export enum REGISTER {
	ZERO = 'R0',

	RETURN = 'R1',

	/** Command point */
	CP = 'R2',
	/** Stack point */
	SP = 'R3',
	/** Thread point */
	TP = 'R4',

	A0 = 'R5',
	A1 = 'R6',
	A2 = 'R7',
	A3 = 'R8',
	A4 = 'R9',
	A5 = 'R10',
	A6 = 'R11',
	A7 = 'R12',

	T0 = 'R13',
	T1 = 'R14',
	T2 = 'R15',
	T3 = 'R16',
	T4 = 'R17',
	T5 = 'R18',
	T6 = 'R19',

	S0 = 'R20',
	S1 = 'R21',
	S2 = 'R22',
	S3 = 'R23',
	S4 = 'R24',
	S5 = 'R25',
	S6 = 'R26',
	S7 = 'R27',
	S8 = 'R28',
	S9 = 'R29',
	S10 = 'R30',
	S11 = 'R31',

	R0 = 'R0',
	R1 = 'R1',
	R2 = 'R2',
	R3 = 'R3',
	R4 = 'R4',
	R5 = 'R5',
	R6 = 'R6',
	R7 = 'R7',
	R8 = 'R8',
	R9 = 'R9',
	R10 = 'R10',
	R11 = 'R11',
	R12 = 'R12',
	R13 = 'R13',
	R14 = 'R14',
	R15 = 'R15',
	R16 = 'R16',
	R17 = 'R17',
	R18 = 'R18',
	R19 = 'R19',
	R20 = 'R20',
	R21 = 'R21',
	R22 = 'R22',
	R23 = 'R23',
	R24 = 'R24',
	R25 = 'R25',
	R26 = 'R26',
	R27 = 'R27',
	R28 = 'R28',
	R29 = 'R29',
	R30 = 'R30',
	R31 = 'R31',
}

export enum REGISTER_KEY {
	R0,
	R1,
	R2,
	R3,
	R4,
	R5,
	R6,
	R7,
	R8,
	R9,
	R10,
	R11,
	R12,
	R13,
	R14,
	R15,
	R16,
	R17,
	R18,
	R19,
	R20,
	R21,
	R22,
	R23,
	R24,
	R25,
	R26,
	R27,
	R28,
	R29,
	R30,
	R31,
}

export enum COMMAND {
	JUMP = 'JUMP',
	JUMP_LINK = 'JUMP_LINK',
	JUMPR = 'JUMPR',
	JUMPR_LINK = 'JUMPR_LINK',

	JUMP_EQ = 'JUMP_EQ',
	JUMP_NE = 'JUMP_NE',
	JUMP_LT = 'JUMP_LT',
	JUMP_GE = 'JUMP_GE',

	HOLD = 'HOLD',
	POP = 'POP',
	PUSH = 'PUSH',

	PRINT = 'PRINT',
	PRINTI = 'PRINTI',

	SET = 'SET',
	ADDI = 'ADDI',
}

export enum COMMAND_KEY {
	JUMP,
	JUMP_LINK,
	JUMPR,
	JUMPR_LINK,
	JUMP_EQ,
	JUMP_NE,
	JUMP_LT,
	JUMP_GE,
	HOLD,
	POP,
	PUSH,
	PRINT,
	PRINTI,
	SET,
	ADDI,
}

/*

32bit 		command length
 8bit		registr name length [RN]
 4bit		command type length [CT]
 6bit		command name length [CN]

00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
 1  1 [OperKey 5bit ][imm:24bit                                                             ] 0
 1  1 [OperKey 5bit ][register 6bit   ][0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0] 0
 1  1 [OperKey 5bit ][register 6bit   ][imm:18bit                                           ] 0
 1  1 [OperKey 5bit ][register 6bit   ][register 6bit   ][0  0  0  0  0  0  0  0  0  0  0  0] 0
 1  1 [OperKey 5bit ][register 6bit   ][register 6bit   ][imm:12bit                         ] 0
 1  1 [OperKey 5bit ][register 6bit   ][register 6bit   ][register 6bit  ] [0  0  0  0  0  0] 0
 1  1 [OperKey 5bit ][register 6bit   ][register 6bit   ][register 6bit  ] [imm:6bit        ] 0




 one arg command:
 4bit[CT] + 8bit[CN] + (20bit[data] | 8bit[RN])

 two arg command:
 4bit[CT] + 8bit[CN] + 20bit[data]


*/

export class Command {
	public Args: any[];

	constructor(public Name: COMMAND, ...Args: any[]) {
		this.Args = Args;
	}
}

export class Command0 {
	public OperKey: COMMAND_KEY = 0;
	public OperName: COMMAND;
	public Arg1 = 0;
	public Arg2 = 0;
	public Arg3 = 0;

	constructor(public Code: number) {
		this.OperKey = (Code & 0b00111110000000000000000000000000) >> 25;
		this.OperName = COMMAND_KEY[this.OperKey] as COMMAND;

		switch (this.OperName) {
			case COMMAND.JUMP:
				break;
		}
	}
}

export class VM2 {
	public Registers: Map<REGISTER_KEY, number> = new Map();
	public Stack: Array<number> = [];
	public Labels: Map<string, number> = new Map();
	public Commands: Array<Command> = [];
	public Holded = false;
	public Running = false;
	public Break = false;
	public RunID = 0;

	constructor(public Code: string) {
		this.Reset();
	}
	public Reset() {
		this.RunID = 0;
		this.Registers = new Map();
		this.Stack = [];
		this.Labels = new Map();
		this.Commands = [];
		this.Holded = false;
		this.Running = false;
		this.Break = false;

		const registers = [
			REGISTER_KEY.R0,
			REGISTER_KEY.R1,
			REGISTER_KEY.R2,
			REGISTER_KEY.R3,
			REGISTER_KEY.R4,
			REGISTER_KEY.R5,
			REGISTER_KEY.R6,
			REGISTER_KEY.R7,
			REGISTER_KEY.R8,
			REGISTER_KEY.R9,
			REGISTER_KEY.R10,
			REGISTER_KEY.R11,
			REGISTER_KEY.R12,
			REGISTER_KEY.R13,
			REGISTER_KEY.R14,
			REGISTER_KEY.R15,
			REGISTER_KEY.R16,
			REGISTER_KEY.R17,
			REGISTER_KEY.R18,
			REGISTER_KEY.R19,
			REGISTER_KEY.R20,
			REGISTER_KEY.R21,
			REGISTER_KEY.R22,
			REGISTER_KEY.R23,
			REGISTER_KEY.R24,
			REGISTER_KEY.R25,
			REGISTER_KEY.R26,
			REGISTER_KEY.R27,
			REGISTER_KEY.R28,
			REGISTER_KEY.R29,
			REGISTER_KEY.R30,
			REGISTER_KEY.R31,
		];
		registers.forEach((key) => {
			this.Registers.set(key, 0);
		});
		this.SetReg(REGISTER_KEY[REGISTER.SP], -1);
		this.Stack = [];
		this.Commands = this.ParseCode(this.Code);
	}
	public ParseCode(code: string): Array<Command> {
		let index = 0;
		const commands: Command[] = code
			.split('\n')
			.map((line) => line.trim().replace(/[ \t]+/g, ' '))
			.filter((line) => {
				if (!line) {
					return false;
				}
				const label = /^LABEL (\w+)$/.exec(line);
				if (label) {
					const labelName = label[1];
					this.Labels.set(labelName, index);
					return false;
				}
				index++;
				return true;
			})
			.map((line) => {
				const [_, command, arg1, arg2, arg3] =
					/^([a-z_]+)([^,]+)?(,[^,]+)?(,[^,]+)?$/i.exec(line) ?? [];

				return new Command(
					COMMAND[command as COMMAND],
					this.ParseArg(arg1?.replace(/[, ]/g, '') ?? null),
					this.ParseArg(arg2?.replace(/[, ]/g, '') ?? null),
					this.ParseArg(arg3?.replace(/[, ]/g, '') ?? null),
				);
			});

		return commands;
	}
	public ParseArg(arg: any): string | number | null {
		if (typeof arg === 'string') {
			if (/^[0-9]+$/.test(arg)) {
				return parseFloat(arg);
			}
			if (this.Labels.has(arg)) {
				return this.Labels.get(arg) as number;
			}
			if (REGISTER[arg as REGISTER]) {
				return REGISTER_KEY[REGISTER[arg as REGISTER]];
			}
		}
		return arg;
	}
	public async Run(commandDelay: number = 0): Promise<void> {
		this.RunID = Math.random();
		const RunID = this.RunID;
		this.BeforeCommand();
		this.Running = true;
		while (!this.Holded) {
			if (this.RunID !== RunID) {
				return;
			}
			this.RunCommand();
			if (this.RunID !== RunID) {
				return;
			}
			if (commandDelay) {
				await new Promise((res) => setTimeout(res, commandDelay));
			}
			if (this.RunID !== RunID) {
				return;
			}
			if (this.Break) {
				this.Break = false;
				break;
			}
		}
		this.Running = false;
		this.AfterCommand();
	}
	public RunCommand() {
		this.BeforeCommand();
		(() => {
			const command = this.Commands[
				this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0
			];

			switch (command.Name) {
				case COMMAND.HOLD:
					this.Holded = true;
					return;
				case COMMAND.POP:
					const SP1 = this.GetReg(REGISTER_KEY[REGISTER.SP]);
					const value1 = this.Stack[SP1];
					this.SetReg(REGISTER_KEY[REGISTER.SP], SP1 - 1);
					this.SetReg(command.Args[0], value1 ?? 0);
					break;
				case COMMAND.PUSH:
					const SP2 = this.GetReg(REGISTER_KEY[REGISTER.SP]);
					const value2 = this.GetReg(command.Args[0]) ?? 0;
					this.Stack[SP2 + 1] = value2;
					if (SP2 + 1 > this.Stack.length - 1) {
						this.Stack.push(0);
					}
					this.SetReg(REGISTER_KEY[REGISTER.SP], SP2 + 1);
					break;
				case COMMAND.PRINT:
					console.log(this.GetReg(command.Args[0]) ?? 0);
					break;
				case COMMAND.PRINTI:
					console.log(command.Args[0]);
					break;

				case COMMAND.JUMP:
					this.SetReg(REGISTER_KEY[REGISTER.CP], command.Args[0]);
					return;
				case COMMAND.JUMP_EQ:
					const val1JUMP_EQ = this.GetReg(command.Args[0]) ?? 0;
					const val2JUMP_EQ = this.GetReg(command.Args[1]) ?? 0;
					const targetJUMP_EQ = command.Args[2];
					if (val1JUMP_EQ === val2JUMP_EQ) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_EQ);
						return;
					}
					break;
				case COMMAND.JUMP_NE:
					const val1JUMP_NE = this.GetReg(command.Args[0]) ?? 0;
					const val2JUMP_NE = this.GetReg(command.Args[1]) ?? 0;
					const targetJUMP_NE = command.Args[2];
					if (val1JUMP_NE !== val2JUMP_NE) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_NE);
						return;
					}
					break;
				case COMMAND.JUMP_LT:
					const val1JUMP_LT = this.GetReg(command.Args[0]) ?? 0;
					const val2JUMP_LT = this.GetReg(command.Args[1]) ?? 0;
					const targetJUMP_LT = command.Args[2];
					if (val1JUMP_LT < val2JUMP_LT) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_LT);
						return;
					}
					break;
				case COMMAND.JUMP_GE:
					const val1JUMP_GE = this.GetReg(command.Args[0]) ?? 0;
					const val2JUMP_GE = this.GetReg(command.Args[1]) ?? 0;
					const targetJUMP_GE = command.Args[2];
					if (val1JUMP_GE >= val2JUMP_GE) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_GE);
						return;
					}
					break;
				case COMMAND.JUMP_LINK:
					const JUMP_LINK_RETURN =
						(this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0) + 1;
					this.SetReg(REGISTER_KEY[REGISTER.CP], command.Args[0]);
					this.SetReg(
						REGISTER_KEY[REGISTER.RETURN],
						JUMP_LINK_RETURN,
					);
					return;
				case COMMAND.JUMPR:
					this.SetReg(
						REGISTER_KEY[REGISTER.CP],
						this.GetReg(command.Args[0]) ?? 0,
					);
					return;
				case COMMAND.JUMPR_LINK:
					const JUMPR_LINK_RETURN =
						(this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0) + 1;
					this.SetReg(
						REGISTER_KEY[REGISTER.CP],
						this.GetReg(command.Args[0]) ?? 0,
					);
					this.SetReg(
						REGISTER_KEY[REGISTER.RETURN],
						JUMPR_LINK_RETURN,
					);
					return;
				case COMMAND.SET:
					this.SetReg(command.Args[0], command.Args[1]);
					break;
				case COMMAND.ADDI:
					this.SetReg(
						command.Args[0],
						this.GetReg(command.Args[1]) + command.Args[2],
					);
					break;
			}

			this.SetReg(
				REGISTER_KEY[REGISTER.CP],
				(this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0) + 1,
			);
		})();
		this.AfterCommand();
	}
	public GetReg(register: REGISTER_KEY): number {
		return this.Registers.get(register) as number;
	}
	public SetReg(register: REGISTER_KEY, value: number): void {
		if (register === 0) {
			return;
		}
		this.Registers.set(register, value);
	}
	public BeforeCommand = () => void 0;
	public AfterCommand = () => void 0;
}
