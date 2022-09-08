import { Call } from "../Call";

export enum REGISTER {
	ZERO = "R0",

	RETURN = "R1",

	/** Command point */
	CP = "R2",
	/** Stack point */
	SP = "R3",
	/** Thread point */
	TP = "R4",

	A0 = "R5",
	A1 = "R6",
	A2 = "R7",
	A3 = "R8",
	A4 = "R9",
	A5 = "R10",
	A6 = "R11",
	A7 = "R12",

	T0 = "R13",
	T1 = "R14",
	T2 = "R15",
	T3 = "R16",
	T4 = "R17",
	T5 = "R18",
	T6 = "R19",

	S0 = "R20",
	S1 = "R21",
	S2 = "R22",
	S3 = "R23",
	S4 = "R24",
	S5 = "R25",
	S6 = "R26",
	S7 = "R27",
	S8 = "R28",
	S9 = "R29",
	S10 = "R30",
	S11 = "R31",

	R0 = "R0",
	R1 = "R1",
	R2 = "R2",
	R3 = "R3",
	R4 = "R4",
	R5 = "R5",
	R6 = "R6",
	R7 = "R7",
	R8 = "R8",
	R9 = "R9",
	R10 = "R10",
	R11 = "R11",
	R12 = "R12",
	R13 = "R13",
	R14 = "R14",
	R15 = "R15",
	R16 = "R16",
	R17 = "R17",
	R18 = "R18",
	R19 = "R19",
	R20 = "R20",
	R21 = "R21",
	R22 = "R22",
	R23 = "R23",
	R24 = "R24",
	R25 = "R25",
	R26 = "R26",
	R27 = "R27",
	R28 = "R28",
	R29 = "R29",
	R30 = "R30",
	R31 = "R31"
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
	R31
}

export enum OPERATION {
	JUMP = "JUMP",
	JUMP_LINK = "JUMP_LINK",
	JUMPR = "JUMPR",
	JUMPR_LINK = "JUMPR_LINK",

	JUMP_EQ = "JUMP_EQ",
	JUMP_NE = "JUMP_NE",
	JUMP_LT = "JUMP_LT",
	JUMP_GE = "JUMP_GE",

	HOLD = "HOLD",
	POP = "POP",
	PUSH = "PUSH",

	PRINT = "PRINT",
	PRINTI = "PRINTI",

	SET = "SET",
	ADDI = "ADDI"
}

export enum OPERATION_KEY {
	NOOP,
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
	ADD,
	ADDI
}

export enum OPERATION_TYPE {
	NO_REG,
	NO_REG_IMM,
	ONE_REG,
	ONE_REG_IMM,
	TWO_REG,
	TWO_REG_IMM,
	THREE_REG,
	THREE_REG_IMM
}

export const CommandsType: Record<OPERATION_KEY, OPERATION_TYPE> = {
	[OPERATION_KEY.NOOP]: OPERATION_TYPE.NO_REG,
	[OPERATION_KEY.JUMP]: OPERATION_TYPE.NO_REG_IMM,
	[OPERATION_KEY.JUMP_LINK]: OPERATION_TYPE.NO_REG_IMM,
	[OPERATION_KEY.JUMPR]: OPERATION_TYPE.ONE_REG,
	[OPERATION_KEY.JUMPR_LINK]: OPERATION_TYPE.ONE_REG,
	[OPERATION_KEY.JUMP_EQ]: OPERATION_TYPE.TWO_REG_IMM,
	[OPERATION_KEY.JUMP_NE]: OPERATION_TYPE.TWO_REG_IMM,
	[OPERATION_KEY.JUMP_LT]: OPERATION_TYPE.TWO_REG_IMM,
	[OPERATION_KEY.JUMP_GE]: OPERATION_TYPE.TWO_REG_IMM,
	[OPERATION_KEY.HOLD]: OPERATION_TYPE.NO_REG,
	[OPERATION_KEY.POP]: OPERATION_TYPE.ONE_REG,
	[OPERATION_KEY.PUSH]: OPERATION_TYPE.ONE_REG,
	[OPERATION_KEY.PRINT]: OPERATION_TYPE.ONE_REG,
	[OPERATION_KEY.PRINTI]: OPERATION_TYPE.NO_REG_IMM,
	[OPERATION_KEY.SET]: OPERATION_TYPE.ONE_REG_IMM,
	[OPERATION_KEY.ADD]: OPERATION_TYPE.THREE_REG,
	[OPERATION_KEY.ADDI]: OPERATION_TYPE.TWO_REG_IMM
};

const MAX_OPERATION_NAME_LENGTH = Object.keys(OPERATION).reduce(
	(result, operName) => {
		return Math.max(result, operName.length);
	},
	0
);

/*

32bit 		command length
 8bit		registr name length [RN]
 4bit		command type length [CT]
 6bit		command name length [CN]

00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
 0  0 [OperKey 5bit ][imm:24bit                                                             ] 1
 0  0 [OperKey 5bit ][register 6bit   ][0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0] 1
 0  0 [OperKey 5bit ][register 6bit   ][imm:18bit                                           ] 1
 0  0 [OperKey 5bit ][register 6bit   ][register 6bit   ][0  0  0  0  0  0  0  0  0  0  0  0] 1
 0  0 [OperKey 5bit ][register 6bit   ][register 6bit   ][imm:12bit                         ] 1
 0  0 [OperKey 5bit ][register 6bit   ][register 6bit   ][register 6bit  ] [0  0  0  0  0  0] 1
 0  0 [OperKey 5bit ][register 6bit   ][register 6bit   ][register 6bit  ] [imm:6bit        ] 1




 one arg command:
 4bit[CT] + 8bit[CN] + (20bit[data] | 8bit[RN])

 two arg command:
 4bit[CT] + 8bit[CN] + 20bit[data]


*/

export function EncodeCode(
	OperName: OPERATION,
	arg1: number,
	arg2: number,
	arg3: number,
	arg4: number
): number {
	const OperKey = OPERATION_KEY[OperName];
	const OperType = CommandsType[OperKey];
	let result = 0b11000000000000000000000000000000;
	result = result | (OperKey << 25);

	switch (OperType) {
		case OPERATION_TYPE.NO_REG:
			Call(() => {
				const imm = arg1 & 0b111111111111111111111111;
				result = result | (imm << 1);
			});
			break;
		case OPERATION_TYPE.NO_REG_IMM:
			Call(() => {
				const imm = arg1 & 0b111111111111111111111111;
				result = result | (imm << 1);
			});
			break;
		case OPERATION_TYPE.ONE_REG:
			Call(() => {
				const reg1 = arg1 & 0b111111;
				result = result | (reg1 << 19);
			});
			break;
		case OPERATION_TYPE.ONE_REG_IMM:
			Call(() => {
				const reg1 = arg1 & 0b111111;
				const imm = arg2 & 0b111111111111111111;
				result = result | (reg1 << 19) | (imm << 1);
			});
			break;
		case OPERATION_TYPE.TWO_REG:
			Call(() => {
				const reg1 = arg1 & 0b111111;
				const reg2 = arg2 & 0b111111;
				result = result | (reg1 << 19) | (reg2 << 13);
			});
			break;
		case OPERATION_TYPE.TWO_REG_IMM:
			Call(() => {
				const reg1 = arg1 & 0b111111;
				const reg2 = arg2 & 0b111111;
				const imm = arg3 & 0b111111111111;
				result = result | (reg1 << 19) | (reg2 << 13) | (imm << 1);
			});
			break;
		case OPERATION_TYPE.THREE_REG:
			Call(() => {
				const reg1 = arg1 & 0b111111;
				const reg2 = arg2 & 0b111111;
				const reg3 = arg3 & 0b111111;
				result = result | (reg1 << 19) | (reg2 << 13) | (reg3 << 7);
			});
			break;
		case OPERATION_TYPE.THREE_REG_IMM:
			Call(() => {
				const reg1 = arg1 & 0b111111;
				const reg2 = arg2 & 0b111111;
				const reg3 = arg3 & 0b111111;
				const imm = arg4 & 0b111111;
				result =
					result |
					(reg1 << 19) |
					(reg2 << 13) |
					(reg3 << 7) |
					(imm << 1);
			});
			break;
	}
	return result;
}

export function ParseCode(
	Code: number
): {
	OperKey: number;
	Imm?: number;
	Reg1?: number;
	Reg2?: number;
	Reg3?: number;
} {
	Code = Code & 0b11111111111111111111111111111111;
	const OperKey = (Code & 0b00111110000000000000000000000000) >> 25;
	const OperType = CommandsType[OperKey];
	switch (OperType) {
		case OPERATION_TYPE.NO_REG:
			return { OperKey };
		case OPERATION_TYPE.NO_REG_IMM:
			var Imm = (Code & 0b00000001111111111111111111111110) >> 1;
			return { OperKey, Imm };
		case OPERATION_TYPE.ONE_REG:
			var Reg1 = (Code & 0b00000001111110000000000000000000) >> 19;
			return { OperKey, Reg1 };
		case OPERATION_TYPE.ONE_REG_IMM:
			var Reg1 = (Code & 0b00000001111110000000000000000000) >> 19;
			var Imm = (Code & 0b00000000000001111111111111111110) >> 1;
			return { OperKey, Reg1, Imm };
		case OPERATION_TYPE.TWO_REG:
			var Reg1 = (Code & 0b00000001111110000000000000000000) >> 19;
			var Reg2 = (Code & 0b00000000000001111110000000000000) >> 13;
			return { OperKey, Reg1, Reg2 };
		case OPERATION_TYPE.TWO_REG_IMM:
			var Reg1 = (Code & 0b00000001111110000000000000000000) >> 19;
			var Reg2 = (Code & 0b00000000000001111110000000000000) >> 13;
			var Imm = (Code & 0b00000000000000000001111111111110) >> 1;
			return { OperKey, Reg1, Reg2, Imm };
		case OPERATION_TYPE.THREE_REG:
			var Reg1 = (Code & 0b00000001111110000000000000000000) >> 19;
			var Reg2 = (Code & 0b00000000000001111110000000000000) >> 13;
			var Reg3 = (Code & 0b00000000000000000001111110000000) >> 7;
			return { OperKey, Reg1, Reg2, Reg3 };
		case OPERATION_TYPE.THREE_REG_IMM:
			var Reg1 = (Code & 0b00000001111110000000000000000000) >> 19;
			var Reg2 = (Code & 0b00000000000001111110000000000000) >> 13;
			var Reg3 = (Code & 0b00000000000000000001111110000000) >> 7;
			var Imm = (Code & 0b00000000000000000000000001111110) >> 1;
			return { OperKey, Reg1, Reg2, Reg3, Imm };
	}
}

export function CodeToHex(Code: number): string {
	return ("0".repeat(8) + Code.toString(16)).slice(-8);
}
export function CodeToBinary(): string {
	let { Code } = this;
	if (0b10000000000000000000000000000000 & Code) {
		return (
			"1".repeat(32) +
			(this.Code & 0b01111111111111111111111111111111).toString(2)
		).slice(-32);
	}
	return ("0".repeat(32) + this.Code.toString(2)).slice(-32);
}
export function CodeToStringFormated(Code: number): string {
	const { OperKey, Reg1, Reg2, Reg3, Imm } = ParseCode(Code);
	if (!OperKey) {
		return CodeToHex(Code);
	}
	const OperType = CommandsType[OperKey];
	let args = Call(() => {
		switch (OperType) {
			case OPERATION_TYPE.NO_REG:
				return "";
			case OPERATION_TYPE.NO_REG_IMM:
				return Imm;
			case OPERATION_TYPE.ONE_REG:
				return `${Reg1}`;
			case OPERATION_TYPE.ONE_REG_IMM:
				return `${Reg1} | ${Imm}`;
			case OPERATION_TYPE.TWO_REG:
				return `${Reg1} | ${Reg2}`;
			case OPERATION_TYPE.TWO_REG_IMM:
				return `${Reg1} | ${Reg2} | ${Imm}`;
			case OPERATION_TYPE.THREE_REG:
				return `${Reg1} | ${Reg2} | ${Reg3}`;
			case OPERATION_TYPE.THREE_REG_IMM:
				return `${Reg1} | ${Reg2} | ${Reg3} | ${Imm}`;
		}
	});
	if (args) {
		args = `: ${args}`;
	}
	return `${(
		OPERATION_KEY[OperKey] + " ".repeat(MAX_OPERATION_NAME_LENGTH)
	).slice(0, MAX_OPERATION_NAME_LENGTH)}${args}`;
}

export class VM4 {
	public Registers: Map<REGISTER_KEY, number> = new Map();
	public Stack: Array<number> = [];
	public Labels: Map<string, number> = new Map();
	public Commands: Array<number> = [];
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
			REGISTER_KEY.R31
		];
		registers.forEach((key) => {
			this.Registers.set(key, 0);
		});
		this.SetReg(REGISTER_KEY[REGISTER.SP], -1);
		this.Stack = [];
		this.Commands = this.ParseCode(this.Code);
	}
	public ParseCode(code: string): Array<number> {
		let index = 0;
		return code
			.split("\n")
			.map((line) => line.trim().replace(/[ \t]+/g, " "))
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
				if (/^[0-9]+$/.test(line)) {
					return parseFloat(line);
				}
				const [, command, arg1, arg2, arg3, arg4] =
					/^([a-z_]+)([^,]+)?(,[^,]+)?(,[^,]+)?(,[^,]+)?$/i.exec(
						line
					) ?? [];
				const arg1Int = this.ParseArg(
					arg1?.replace(/[, ]/g, "") ?? 0
				) as number;
				const arg2Int = this.ParseArg(
					arg2?.replace(/[, ]/g, "") ?? 0
				) as number;
				const arg3Int = this.ParseArg(
					arg3?.replace(/[, ]/g, "") ?? 0
				) as number;
				const arg4Int = this.ParseArg(
					arg4?.replace(/[, ]/g, "") ?? 0
				) as number;

				return EncodeCode(
					command as OPERATION,
					arg1Int,
					arg2Int,
					arg3Int,
					arg4Int
				);
			});
	}
	public ParseArg(arg: any): string | number | null {
		if (typeof arg === "string") {
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
			const code = this.Commands[
				this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0
			];

			const command = ParseCode(code);

			switch (command.OperKey) {
				case OPERATION_KEY.HOLD:
					this.Holded = true;
					return;
				case OPERATION_KEY.POP:
					let SP1 = this.GetReg(REGISTER_KEY[REGISTER.SP]);
					const value1 = this.Stack[SP1];
					SP1--;
					if (this.Stack.length / 2 > SP1) {
						if (SP1 === -1) {
							this.Stack = [];
						} else {
							this.Stack = this.Stack.slice(
								0,
								this.Stack.length / 2
							);
						}
					}
					this.SetReg(REGISTER_KEY[REGISTER.SP], SP1);
					this.SetReg(command.Reg1, value1 ?? 0);
					break;
				case OPERATION_KEY.PUSH:
					let SP2 = this.GetReg(REGISTER_KEY[REGISTER.SP]);
					const value2 = this.GetReg(command.Reg1) ?? 0;
					SP2++;
					if (SP2 > this.Stack.length - 1) {
						this.Stack = [
							...this.Stack,
							...new Array(this.Stack.length || 1)
						];
					}
					this.Stack[SP2] = value2;
					this.SetReg(REGISTER_KEY[REGISTER.SP], SP2);
					break;
				case OPERATION_KEY.PRINT:
					console.log(this.GetReg(command.Reg1) ?? 0);
					break;
				case OPERATION_KEY.PRINTI:
					console.log(command.Imm);
					break;

				case OPERATION_KEY.JUMP:
					this.SetReg(REGISTER_KEY[REGISTER.CP], command.Imm);
					return;
				case OPERATION_KEY.JUMP_EQ:
					const val1JUMP_EQ = this.GetReg(command.Reg1) ?? 0;
					const val2JUMP_EQ = this.GetReg(command.Reg2) ?? 0;
					const targetJUMP_EQ = command.Imm;
					if (val1JUMP_EQ === val2JUMP_EQ) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_EQ);
						return;
					}
					break;
				case OPERATION_KEY.JUMP_NE:
					const val1JUMP_NE = this.GetReg(command.Reg1) ?? 0;
					const val2JUMP_NE = this.GetReg(command.Reg2) ?? 0;
					const targetJUMP_NE = command.Imm;
					if (val1JUMP_NE !== val2JUMP_NE) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_NE);
						return;
					}
					break;
				case OPERATION_KEY.JUMP_LT:
					const val1JUMP_LT = this.GetReg(command.Reg1) ?? 0;
					const val2JUMP_LT = this.GetReg(command.Reg2) ?? 0;
					const targetJUMP_LT = command.Imm;
					if (val1JUMP_LT < val2JUMP_LT) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_LT);
						return;
					}
					break;
				case OPERATION_KEY.JUMP_GE:
					const val1JUMP_GE = this.GetReg(command.Reg1) ?? 0;
					const val2JUMP_GE = this.GetReg(command.Reg2) ?? 0;
					const targetJUMP_GE = command.Imm;
					if (val1JUMP_GE >= val2JUMP_GE) {
						this.SetReg(REGISTER_KEY[REGISTER.CP], targetJUMP_GE);
						return;
					}
					break;
				case OPERATION_KEY.JUMP_LINK:
					const JUMP_LINK_RETURN =
						(this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0) + 1;
					this.SetReg(REGISTER_KEY[REGISTER.CP], command.Imm);
					this.SetReg(
						REGISTER_KEY[REGISTER.RETURN],
						JUMP_LINK_RETURN
					);
					return;
				case OPERATION_KEY.JUMPR:
					this.SetReg(
						REGISTER_KEY[REGISTER.CP],
						this.GetReg(command.Reg1) ?? 0
					);
					return;
				case OPERATION_KEY.JUMPR_LINK:
					const JUMPR_LINK_RETURN =
						(this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0) + 1;
					this.SetReg(
						REGISTER_KEY[REGISTER.CP],
						this.GetReg(command.Reg1) ?? 0
					);
					this.SetReg(
						REGISTER_KEY[REGISTER.RETURN],
						JUMPR_LINK_RETURN
					);
					return;
				case OPERATION_KEY.SET:
					this.SetReg(command.Reg1, command.Imm);
					break;
				case OPERATION_KEY.ADDI:
					this.SetReg(
						command.Reg1,
						this.GetReg(command.Reg2) + command.Imm
					);
					break;
			}

			this.SetReg(
				REGISTER_KEY[REGISTER.CP],
				(this.GetReg(REGISTER_KEY[REGISTER.CP]) ?? 0) + 1
			);
		})();
		this.AfterCommand();
	}
	public GetReg(register: REGISTER_KEY): number {
		if (register === 0) {
			return 0;
		}
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
