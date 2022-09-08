export const code = `
	CALL: main, 1, 2
	RETURN: result

	FUNC: main
		PARAM: 0, a
		PARAM: 1, b
		CALL: Add, a, b
		SET: result, RESULT
		CALL: goto_test
		CALL: loop_test

	RETURN: result

	FUNC: goto_test
		PRINT: 10
		JUMP: goto_test_3
		PRINT: 20
		LABEL: goto_test_3
		PRINT: 30

	RETURN: 0

	FUNC: loop_test
		SET: i, 0
		LABEL: Loop_start
			IF_LESS: i, 10000, Loop_body
			JUMP: Loop_exit

			LABEL: Loop_body
				ADD: i, 1
				PRINT: i
				JUMP: Loop_start

			LABEL: Loop_exit
		RETURN: 0

	FUNC: Add
		PARAM: 0, P1
		PARAM: 1, P2
		ADD: P1, P2
		PRINT: P1, P2
	RETURN: P1
`;
