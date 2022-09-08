// import { COMMAND, VM } from './VM';
// import { code } from './VMCode';
import { code2 } from "./VMCode2";
import { REGISTER, REGISTER_KEY, VM2 } from "./VM2";

// const vm = new VM(VM.ParseCode(code));

// const formatVM = vm.code.map((line) => {
// 	line = { ...line };
// 	line.Command = (COMMAND[line.Command] as any) as COMMAND;
// 	return line;
// });
// (document.getElementById(
// 	'output',
// ) as HTMLDivElement).innerHTML += JSON.stringify(formatVM, null, '\t');

// (async () => {
// 	const start = Date.now();
// 	const result = await vm.Run();
// 	const time = Date.now() - start;
// 	console.log({ result, time, tickCount: vm.TickCount });
// })();

function renderRegisters(vm: VM2) {
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
	const $el = document.querySelector("#vm-registers-list") as HTMLDivElement;
	$el.innerHTML = "";
	for (const register of registers) {
		$el.innerHTML += `
			<div class="vm-register">
				<div class="vm-register__name">${REGISTER_KEY[register]}</div>
				<div class="vm-register__value">${vm.Registers.get(register)}</div>
			</div>
		`;
	}
}

function renderStack(vm: VM2) {
	const $el = document.querySelector("#vm-stack-list") as HTMLDivElement;
	$el.innerHTML = "";
	let index = 0;
	const currentIndex = vm.Registers.get(REGISTER_KEY[REGISTER.SP]);
	for (const stack of vm.Stack) {
		$el.innerHTML += `
			<div class="vm-stack ${currentIndex === index ? "current" : ""}">
				<div class="vm-stack__name">${index}</div>
				<div class="vm-stack__value">${stack}</div>
			</div>
		`;
		index++;
	}
}

function renderCommans(vm: VM2) {
	const $el = document.querySelector("#vm-commands-list") as HTMLDivElement;
	$el.innerHTML = "";
	let index = 0;
	const currentIndex = vm.Registers.get(REGISTER_KEY[REGISTER.CP]);
	const labels: Map<number, string> = new Map();

	vm.Labels.forEach((value, key) => {
		labels.set(value, key);
	});

	for (const command of vm.Commands) {
		let label = labels.has(index) ? labels.get(index) : "";
		if (label) {
			label = `[${label}] `;
		}
		$el.innerHTML += `
			<div class="vm-command ${currentIndex === index ? "current" : ""}">
				<div class="vm-command__name">
				${("000" + index).slice(-3)} | ${label}${command.Name}
				</div>
				<div class="vm-command__arg">${command.Args[0] ?? ""}</div>
				<div class="vm-command__arg">${command.Args[1] ?? ""}</div>
				<div class="vm-command__arg">${command.Args[2] ?? ""}</div>
			</div>
		`;
		index++;
	}
}
function renderButtons(vm: VM2) {
	const $runButton = document.querySelector("#vm-run") as HTMLButtonElement;
	const $stopButton = document.querySelector("#vm-stop") as HTMLButtonElement;

	$runButton.toggleAttribute("disabled", vm.Running);
	$stopButton.toggleAttribute("disabled", !vm.Running);
}

function render(vm: VM2) {
	renderRegisters(vm);
	renderStack(vm);
	renderCommans(vm);
	renderButtons(vm);
}

const vm = new VM2(code2);
render(vm);

vm.BeforeCommand = () => void render(vm);
vm.AfterCommand = () => void render(vm);

(document.querySelector("#vm-next") as HTMLButtonElement).addEventListener(
	"click",
	(event) => {
		event.preventDefault();
		vm.RunCommand();
	}
);
(document.querySelector("#vm-run") as HTMLButtonElement).addEventListener(
	"click",
	(event) => {
		event.preventDefault();
		vm.Run(300);
	}
);
(document.querySelector("#vm-stop") as HTMLButtonElement).addEventListener(
	"click",
	(event) => {
		event.preventDefault();
		vm.Break = true;
	}
);
(document.querySelector("#vm-reset") as HTMLButtonElement).addEventListener(
	"click",
	(event) => {
		event.preventDefault();
		vm.Reset();
		render(vm);
	}
);
