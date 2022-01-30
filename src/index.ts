import { VM } from './VM';
import { code } from './code';

const vm = new VM(VM.ParseCode(code));

(async () => {
	const start = Date.now();
	const result = await vm.Run();
	const time = Date.now() - start;
	console.log({ result, time, tickCount: vm.TickCount });
})();
