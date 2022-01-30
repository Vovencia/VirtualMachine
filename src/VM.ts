export enum COMMAND {
	NOOP = 0,
	CALL,
	ADD,
	SET,
	FUNC,
	PARAM,
	RETURN,
	GOTO,
	LABEL,
	PRINT,
	IF_LESS,
	IF_EQUAL,
	IF_BIGGER
}

export enum REGISTER {
	RESULT = 'RESULT',
	RETURN = 'RESULT',
	MOUSE_X = 'MOUSE_X',
	MOUSE_Y = 'MOUSE_Y'
}

async function NextTick(): Promise<void> {
	return new Promise((res) => setTimeout(res, 0));
}

export class VM {
	public static ParseCode(codeStr: string): Code {
		codeStr = codeStr.replace(/[ \t]/g, '');
		const codeLines = codeStr.split('\n');

		let code: Code = codeLines
			.filter((line) => !line.startsWith('#'))
			.map((line, index) => {
				const Line = index;
				if (!line) {
					return { Command: COMMAND.NOOP, Args: [], Line };
				}
				const tmp = line.split(':');
				const Command = (COMMAND[tmp[0] as any] as any) as COMMAND;
				const Args = (tmp[1] || '').split(',').map((arg) => {
					if (/^[0-9]+$/.test(arg)) {
						return parseFloat(arg);
					}
					return arg;
				});
				return { Command, Args, Line };
			});

		function getLabelLine(labelName: string): number {
			const labelLine = code.find((_line) => {
				return (
					_line.Command === COMMAND.LABEL &&
					_line.Args[0] === labelName
				);
			});
			return labelLine ? labelLine.Line : -1;
		}

		code = code.map((line) => {
			switch (line.Command) {
				case COMMAND.CALL:
					const funcName = line.Args[0];
					const funcLine = code.find((_line) => {
						return (
							_line.Command === COMMAND.FUNC &&
							_line.Args[0] === funcName
						);
					});
					line.Args[0] = funcLine ? funcLine.Line : -1;
					break;
				case COMMAND.GOTO:
					line.Args[0] = getLabelLine(line.Args[0]);
					break;
				case COMMAND.IF_LESS:
				case COMMAND.IF_BIGGER:
				case COMMAND.IF_EQUAL:
					// IF_LESS: i, 10, Loop_body
					const trueCheck = line.Args[2];
					line.Args[2] = getLabelLine(trueCheck);
					break;
			}
			return line;
		});

		return code;
	}
	protected register: Map<string, number> = new Map();
	protected funcStack: Map<string, number> = new Map();
	protected stackIndexs: Array<number> = [];
	protected stackParams: Array<Array<any>> = [];
	protected tick = 0;
	protected tickCountDelay = 10000;
	protected isDebug = false;
	public TickCount = 0;

	constructor(protected code: Code) {}

	public get CurrentIndex(): number {
		return (
			this.stackIndexs[this.stackIndexs.length - 1] ?? this.code.length
		);
	}
	public SetCurrentIndex(index: number) {
		if (!this.stackIndexs.length) {
			return;
		}
		this.stackIndexs[this.stackIndexs.length - 1] = index;
	}
	public Print(value: any[]): void {
		// console.log(...value);
		// const output = document.getElementById('output') as HTMLDivElement;
		// output.innerHTML += value.join(' ') + `<br/>`;
	}
	public mouseMoveCallback = (event: MouseEvent) => {
		this.ToRegister(REGISTER.MOUSE_X, event.clientX);
		this.ToRegister(REGISTER.MOUSE_Y, event.clientY);
	};
	public async Run(): Promise<number> {
		this.stackIndexs.push(0);
		this.stackParams.push([]);
		const debug = document.getElementById('debug') as HTMLDivElement;

		document.addEventListener('mousemove', (event) => {
			debug.innerHTML = `X: ${event.clientX} | Y: ${event.clientY}`;
		});

		while (this.CurrentIndex < this.code.length) {
			this.tick++;
			this.TickCount++;
			if (this.tick > this.tickCountDelay) {
				await NextTick();
				this.tick = 0;
			}

			const { Command, Args, Line } = this.code[this.CurrentIndex];
			if (this.isDebug) {
				debug.innerHTML += `${JSON.stringify({
					Command: (COMMAND[Command] + '____________').slice(0, 10),
					Args,
					Line
				})}<br>`;
			}
			switch (Command) {
				case COMMAND.NOOP:
					break;
				case COMMAND.SET:
					this.ToRegister(Args[0], this.GetValue(Args[1]));
					break;
				case COMMAND.ADD:
					this.ToRegister(
						REGISTER.RESULT,
						this.GetValue(Args[0]) + this.GetValue(Args[1])
					);
					break;
				case COMMAND.RETURN:
					this.ToRegister(REGISTER.RETURN, this.GetValue(Args[0]));
					this.stackIndexs.pop();
					this.stackParams.pop();
					break;
				case COMMAND.CALL:
					const nextCommandLine = Args[0];
					const _args = Args.slice(1).map((arg) =>
						this.GetValue(arg)
					);
					this.stackParams.push(_args);
					this.stackIndexs.push(nextCommandLine);
					break;
				case COMMAND.PARAM:
					const indexParam = Args[0];
					const key = Args[1];
					this.ToRegister(
						key,
						this.GetValue(this.GetParam(indexParam))
					);
					break;
				case COMMAND.PRINT:
					if (this.isDebug) {
						this.Print([
							`[${Line + 1}]:`,
							...Args.map((arg) => this.GetValue(arg))
						]);
					}
					break;
				case COMMAND.GOTO:
					const newLine = Args[0];
					this.SetCurrentIndex(newLine);
					break;
				case COMMAND.IF_LESS: {
					const value1 = this.GetValue(Args[0]);
					const value2 = this.GetValue(Args[1]);
					if (value1 < value2) {
						const newLine = Args[2];
						this.SetCurrentIndex(newLine);
					}
					break;
				}
				case COMMAND.IF_BIGGER: {
					const value1 = this.GetValue(Args[0]);
					const value2 = this.GetValue(Args[1]);
					if (value1 > value2) {
						const newLine = Args[2];
						this.SetCurrentIndex(newLine);
					}
					break;
				}
				case COMMAND.IF_EQUAL: {
					const value1 = this.GetValue(Args[0]);
					const value2 = this.GetValue(Args[1]);
					if (value1 === value2) {
						const newLine = Args[2];
						this.SetCurrentIndex(newLine);
					}
					break;
				}
			}
			this.SetCurrentIndex(this.CurrentIndex + 1);
		}
		return this.FromRegister(REGISTER.RETURN) ?? 0;
	}
	public GetValue(input: string | number): number {
		if (typeof input === 'number') {
			return input;
		}
		return this.FromRegister(input) ?? 0;
	}
	public ToRegister(name: string, value: number): void {
		this.register.set(name, value);
	}
	public FromRegister(name: string): number | null {
		return this.register.get(name) ?? null;
	}
	public GetParam(index: number): any {
		return this.stackParams[this.stackParams.length - 1][index];
	}
}

type Code = Array<CodeLine>;

interface CodeLine {
	Line: number;
	Command: COMMAND;
	Args: any[];
}
