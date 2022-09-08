/*

Список регистров
R0-R31 - название регистров
R0      (ZERO)              - регистр хранящий всегда 0

R1      (R, RETURN)         - адрес возврата
R2      (SP, STACK_POINT)   - адрес стека
R3      (GP, GLOBAL_POINT)
R4      (TP, THREAD_POINT)

R5-R13  (A0-A7)             - аргументы функции
R14-R19 (T0-T6)             - временные переменные
R20-R31 (S0-S11)            - сохраняемые переменные

PC      (PROGRAM_COUNTER)   - счётчик команд

Список комманд:
SET R1, 1           - запись константы в регистр R1
MOVE R1, R2         - копирование в регистр "R1" значения из регистра "R2"

JUMP 4              - безусловный переход по значению из регистра
                      без сохранения адреса возврата
JUMP_LINK 4         - безусловный переход по значению из регистра
                      с сохранением адреса возврата
JUMP_EQ R1, R2, 4   - условный переход, увеличение PC на 4,
                      если R1 == R2 (EQual)
JUMP_NE R1, R2, 4   - условный переход, увеличение PC на 4,
                      если R1 != R2 (Not Equal)
JUMP_LT R1, R2, 4   - условный переход, увеличение PC на 4,
                      если R1 < R2 (Less Then)
JUMP_GE R1, R2, 4   - условный переход, увеличение PC на 4,
                      если R1 >= R2 (Greater or Equal)

JUMPR R1            - безусловный переход по значению из регистра
                      без сохранения адреса возврата
JUMPR_LINK R1       - безусловный переход по значению из регистра
                      с сохранением адреса возврата
JUMPR_EQ R1, R2, R1 - условный переход, запись в PC адреса из R1,
                      если R1 == R2 (EQual)
JUMPR_NE R1, R2, R1 - условный переход, запись в PC адреса из R1,
                      если R1 != R2 (Not Equal)
JUMPR_LT R1, R2, R1 - условный переход, запись в PC адреса из R1,
                      если R1 < R2 (Less Then)
JUMPR_GE R1, R2, R1 - условный переход, запись в PC адреса из R1,
                      если R1 >= R2 (Greater or Equal)

ADD R1, R2, R3      - сохранить в регистре R1 сумму R2 и R3
ADDI R1, R2, 1      - сохранить в регистре R1 сумму R2 и 1

SUB R1, R2, R3      - сохранить в регистре R1 разницу R2 и R3
SUBI R1, R2, 1      - сохранить в регистре R1 разницу R2 и 1

LABEL SomeLabel     - метка адреса

PUSH R1             - сохранить в стэк
POP R1              - выгрузить из стэка

PRINT R1            - вывести в консоль
PRINTI 1            - вывести в консоль

HOLD                - остановить выполнение
*/

export const code2 = `
    JUMP_LINK main
    JUMP end

    LABEL main
        JUMP main_body
        LABEL arg1
        10
        LABEL arg2
        20


        LABEL main_body
        PUSH    	RETURN
        PUSH    	A1
        PUSH    	A2
        PUSH		S0

        SET 		A1, 1
        SET 		A2, 2
        JUMP_LINK 	add
        PRINT 		S0

        POP S0
        POP A2
        POP A1

        JUMP_LINK   goto_test
        JUMP_LINK   loop_test

        POP         RETURN

        JUMPR RETURN

    LABEL goto_test
        PRINTI 1
        JUMP goto_test_2
        PRINTI 2
        LABEL goto_test_2
        PRINTI 3
        JUMPR RETURN

    LABEL loop_test
        SET T0, 0
        SET T1, 5

        LABEL loop_test_head
            JUMP_GE T0, T1, loop_test_end
            PRINT T0
            ADDI T0, T0, 1
            JUMP loop_test_head

        LABEL loop_test_end
        JUMPR RETURN

    LABEL add
        ADD S0, A1, A2
        JUMPR RETURN

    LABEL end
    HOLD
`;
