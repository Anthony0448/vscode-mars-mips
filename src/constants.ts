type Instruction = { syntax: string; description: string };
type InstructionInfo = { [mnemonic: string]: Instruction };
type Register = { number: number; description: string };
type RegisterInfo = { [name: string]: Register };
type TermInfo = { [key: string]: string };

const instructions: InstructionInfo = {
    "abs.d": {
        syntax: "abs.d $f2, $f4",
        description:
            "Floating point absolute value double precision : Set $f2 to absolute value of $f4, double precision",
    },
    "abs.s": {
        syntax: "abs.s $f0, $f1",
        description:
            "Floating point absolute value single precision : Set $f0 to absolute value of $f1, single precision",
    },
    add: { syntax: "add $t1, $t2, $t3", description: "Addition with overflow : set $t1 to ($t2 plus $t3)" },
    "add.d": {
        syntax: "add.d $f2, $f4, $f6",
        description:
            "Floating point addition double precision : Set $f2 to double-precision floating point value of $f4 plus $f6",
    },
    "add.s": {
        syntax: "add.s $f0, $f1, $f3",
        description:
            "Floating point addition single precision : Set $f0 to single-precision floating point value of $f1 plus $f3",
    },
    addi: {
        syntax: "addi $t1, $t2, -100",
        description: "Addition immediate with overflow : set $t1 to ($t2 plus signed 16-bit immediate)",
    },
    addiu: {
        syntax: "addiu $t1, $t2, -100",
        description:
            "Addition immediate unsigned without overflow : set $t1 to ($t2 plus signed 16-bit immediate), no overflow",
    },
    addu: {
        syntax: "addu $t1, $t2, $t3",
        description: "Addition unsigned without overflow : set $t1 to ($t2 plus $t3), no overflow",
    },
    and: { syntax: "and $t1, $t2, $t3", description: "Bitwise AND : Set $t1 to bitwise AND of $t2 and $t3" },
    andi: {
        syntax: "andi $t1, $t2, 100",
        description: "Bitwise AND immediate : Set $t1 to bitwise AND of $t2 and zero-extended 16-bit immediate",
    },
    bc1f: {
        syntax: "bc1f label",
        description:
            "Branch if FP condition flag 0 false (BC1F, not BCLF) : If Coprocessor 1 condition flag 0 is false (zero) then branch to statement at label's address",
    },
    bc1t: {
        syntax: "bc1t label",
        description:
            "Branch if FP condition flag 0 true (BC1T, not BCLT) : If Coprocessor 1 condition flag 0 is true (one) then branch to statement at label's address",
    },
    beq: {
        syntax: "beq $t1, $t2, label",
        description: "Branch if equal : Branch to statement at label's address if $t1 and $t2 are equal",
    },
    bgez: {
        syntax: "bgez $t1, label",
        description:
            "Branch if greater than or equal to zero : Branch to statement at label's address if $t1 is greater than or equal to zero",
    },
    bgezal: {
        syntax: "bgezal $t1, label",
        description:
            "Branch if greater then or equal to zero and link : If $t1 is greater than or equal to zero, then set $ra to the Program Counter and branch to statement at label's address",
    },
    bgtz: {
        syntax: "bgtz $t1, label",
        description: "Branch if greater than zero : Branch to statement at label's address if $t1 is greater than zero",
    },
    blez: {
        syntax: "blez $t1, label",
        description:
            "Branch if less than or equal to zero : Branch to statement at label's address if $t1 is less than or equal to zero",
    },
    bltz: {
        syntax: "bltz $t1, label",
        description: "Branch if less than zero : Branch to statement at label's address if $t1 is less than zero",
    },
    bltzal: {
        syntax: "bltzal $t1, label",
        description:
            "Branch if less than zero and link : If $t1 is less than or equal to zero, then set $ra to the Program Counter and branch to statement at label's address",
    },
    bne: {
        syntax: "bne $t1, $t2, label",
        description: "Branch if not equal : Branch to statement at label's address if $t1 and $t2 are not equal",
    },
    break: {
        syntax: "break 100",
        description: "Break execution with code : Terminate program execution with specified exception code",
    },
    "c.eq.d": {
        syntax: "c.eq.d $f2, $f4",
        description:
            "Compare equal double precision : If $f2 is equal to $f4 (double-precision), set Coprocessor 1 condition flag 0 true else set it false",
    },
    "c.eq.s": {
        syntax: "c.eq.s $f0, $f1",
        description:
            "Compare equal single precision : If $f0 is equal to $f1, set Coprocessor 1 condition flag 0 true else set it false",
    },
    "c.le.d": {
        syntax: "c.le.d $f2, $f4",
        description:
            "Compare less or equal double precision : If $f2 is less than or equal to $f4 (double-precision), set Coprocessor 1 condition flag 0 true else set it false",
    },
    "c.le.s": {
        syntax: "c.le.s $f0, $f1",
        description:
            "Compare less or equal single precision : If $f0 is less than or equal to $f1, set Coprocessor 1 condition flag 0 true else set it false",
    },
    "c.lt.d": {
        syntax: "c.lt.d $f2, $f4",
        description:
            "Compare less than double precision : If $f2 is less than $f4 (double-precision), set Coprocessor 1 condition flag 0 true else set it false",
    },
    "c.lt.s": {
        syntax: "c.lt.s $f0, $f1",
        description:
            "Compare less than single precision : If $f0 is less than $f1, set Coprocessor 1 condition flag 0 true else set it false",
    },
    "ceil.w.d": {
        syntax: "ceil.w.d $f1, $f2",
        description:
            "Ceiling double precision to word : Set $f1 to 32-bit integer ceiling of double-precision float in $f2",
    },
    "ceil.w.s": {
        syntax: "ceil.w.s $f0, $f1",
        description:
            "Ceiling single precision to word : Set $f0 to 32-bit integer ceiling of single-precision float in $f1",
    },
    clo: {
        syntax: "clo $t1, $t2",
        description:
            "Count number of leading ones : Set $t1 to the count of leading one bits in $t2 starting at most significant bit position",
    },
    clz: {
        syntax: "clz $t1, $t2",
        description:
            "Count number of leading zeroes : Set $t1 to the count of leading zero bits in $t2 starting at most significant bit positio",
    },
    "cvt.d.s": {
        syntax: "cvt.d.s $f2, $f1",
        description:
            "Convert from single precision to double precision : Set $f2 to double precision equivalent of single precision value in $f1",
    },
    "cvt.d.w": {
        syntax: "cvt.d.w $f2, $f1",
        description:
            "Convert from word to double precision : Set $f2 to double precision equivalent of 32-bit integer value in $f1",
    },
    "cvt.s.d": {
        syntax: "cvt.s.d $f1, $f2",
        description:
            "Convert from double precision to single precision : Set $f1 to single precision equivalent of double precision value in $f2",
    },
    "cvt.s.w": {
        syntax: "cvt.s.w $f0, $f1",
        description:
            "Convert from word to single precision : Set $f0 to single precision equivalent of 32-bit integer value in $f2",
    },
    "cvt.w.d": {
        syntax: "cvt.w.d $f1, $f2",
        description:
            "Convert from double precision to word : Set $f1 to 32-bit integer equivalent of double precision value in $f2",
    },
    "cvt.w.s": {
        syntax: "cvt.w.s $f0, $f1",
        description:
            "Convert from single precision to word : Set $f0 to 32-bit integer equivalent of single precision value in $f1",
    },
    div: {
        syntax: "div $t1, $t2",
        description:
            "Division with overflow : Divide $t1 by $t2 then set LO to quotient and HI to remainder (use mfhi to access HI, mflo to access LO)",
    },
    "div.d": {
        syntax: "div.d $f2, $f4, $f6",
        description:
            "Floating point division double precision : Set $f2 to double-precision floating point value of $f4 divided by $f6",
    },
    "div.s": {
        syntax: "div.s $f0, $f1, $f3",
        description:
            "Floating point division single precision : Set $f0 to single-precision floating point value of $f1 divided by $f3",
    },
    divu: {
        syntax: "divu $t1, $t2",
        description:
            "Division unsigned without overflow : Divide unsigned $t1 by $t2 then set LO to quotient and HI to remainder (use mfhi to access HI, mflo to access LO)",
    },
    eret: {
        syntax: "eret",
        description:
            "Exception return : Set Program Counter to Coprocessor 0 EPC register value, set Coprocessor Status register bit 1 (exception level) to zero",
    },
    "floor.w.d": {
        syntax: "floor.w.d $f1, $f2",
        description:
            "Floor double precision to word : Set $f1 to 32-bit integer floor of double-precision float in $f2",
    },
    "floor.w.s": {
        syntax: "floor.w.s $f0, $f1",
        description:
            "Floor single precision to word : Set $f0 to 32-bit integer floor of single-precision float in $f1",
    },
    j: { syntax: "j target", description: "Jump unconditionally : Jump to statement at target address" },
    jal: {
        syntax: "jal target",
        description:
            "Jump and link : Set $ra to Program Counter (return address) then jump to statement at target address",
    },
    jalr: {
        syntax: "jalr $t1, $t2",
        description:
            "Jump and link register : Set $t1 to Program Counter (return address) then jump to statement whose address is in $t2",
    },
    jr: { syntax: "jr $t1", description: "Jump register unconditionally : Jump to statement whose address is in $t1" },
    lb: {
        syntax: "lb $t1, -100($t2)",
        description: "Load byte : Set $t1 to sign-extended 8-bit value from effective memory byte address",
    },
    lbu: {
        syntax: "lbu $t1, -100($t2)",
        description: "Load byte unsigned : Set $t1 to zero-extended 8-bit value from effective memory byte address",
    },
    ldc1: {
        syntax: "ldc1 $f2, -100($t2)",
        description:
            "Load double word Coprocessor 1 (FPU)) : Set $f2 to 64-bit value from effective memory doubleword address",
    },
    lh: {
        syntax: "lh $t1, -100($t2)",
        description: "Load halfword : Set $t1 to sign-extended 16-bit value from effective memory halfword address",
    },
    lhu: {
        syntax: "lhu $t1, -100($t2)",
        description:
            "Load halfword unsigned : Set $t1 to zero-extended 16-bit value from effective memory halfword address",
    },
    ll: {
        syntax: "ll $t1, -100($t2)",
        description:
            "Load linked : Paired with Store Conditional (sc) to perform atomic read-modify-write. Treated as equivalent to Load Word (lw) because MARS does not simulate multiple processors.",
    },
    lui: {
        syntax: "lui $t1, 100",
        description:
            "Load upper immediate : Set high-order 16 bits of $t1 to 16-bit immediate and low-order 16 bits to 0",
    },
    lw: {
        syntax: "lw $t1, -100($t2)",
        description: "Load word : Set $t1 to contents of effective memory word address",
    },
    lwc1: {
        syntax: "lwc1 $f1, -100($t2)",
        description: "Load word into Coprocessor 1 (FPU) : Set $f1 to 32-bit value from effective memory word address",
    },
    lwl: {
        syntax: "lwl $t1, -100($t2)",
        description:
            "Load word left : Load from 1 to 4 bytes left-justified into $t1, starting with effective memory byte address and continuing through the low-order byte of its word",
    },
    lwr: {
        syntax: "lwr $t1, -100($t2)",
        description:
            "Load word right : Load from 1 to 4 bytes right-justified into $t1, starting with effective memory byte address and continuing through the high-order byte of its word",
    },
    madd: {
        syntax: "madd $t1, $t2",
        description:
            "Multiply add : Multiply $t1 by $t2 then increment HI by high-order 32 bits of product, increment LO by low-order 32 bits of product (use mfhi to access HI, mflo to access LO)",
    },
    maddu: {
        syntax: "maddu $t1, $t2",
        description:
            "Multiply add unsigned : Multiply $t1 by $t2 then increment HI by high-order 32 bits of product, increment LO by low-order 32 bits of product, unsigned (use mfhi to access HI, mflo to access LO)",
    },
    mfc0: {
        syntax: "mfc0 $t1, $8",
        description: "Move from Coprocessor 0 : Set $t1 to the value stored in Coprocessor 0 register $8",
    },
    mfc1: {
        syntax: "mfc1 $t1, $f1",
        description: "Move from Coprocessor 1 (FPU) : Set $t1 to value in Coprocessor 1 register $f1",
    },
    mfhi: {
        syntax: "mfhi $t1",
        description: "Move from HI register : Set $t1 to contents of HI (see multiply and divide operations)",
    },
    mflo: {
        syntax: "mflo $t1",
        description: "Move from LO register : Set $t1 to contents of LO (see multiply and divide operations)",
    },
    "mov.d": {
        syntax: "mov.d $f2, $f4",
        description: "Move floating point double precision : Set double precision $f2 to double precision value in $f4",
    },
    "mov.s": {
        syntax: "mov.s $f0, $f1",
        description: "Move floating point single precision : Set single precision $f0 to single precision value in $f1",
    },
    movf: {
        syntax: "movf $t1, $t2",
        description:
            "Move if FP condition flag 0 false : Set $t1 to $t2 if FPU (Coprocessor 1) condition flag 0 is false (zero)",
    },
    "movf.d": {
        syntax: "movf.d $f2, $f4",
        description:
            "Move floating point double precision : If condition flag 0 false, set double precision $f2 to double precision value in $f4",
    },
    "movf.s": {
        syntax: "movf.s $f0, $f1",
        description:
            "Move floating point single precision : If condition flag 0 is false, set single precision $f0 to single precision value in $f1",
    },
    movn: {
        syntax: "movn $t1, $t2, $t3",
        description: "Move conditional not zero : Set $t1 to $t2 if $t3 is not zero",
    },
    "movn.d": {
        syntax: "movn.d $f2, $f4, $t3",
        description:
            "Move floating point double precision : If $t3 is not zero, set double precision $f2 to double precision value in $f4",
    },
    "movn.s": {
        syntax: "movn.s $f0, $f1, $t3",
        description:
            "Move floating point single precision : If $t3 is not zero, set single precision $f0 to single precision value in $f1",
    },
    movt: {
        syntax: "movt $t1, $t2",
        description:
            "Move if FP condition flag 0 true : Set $t1 to $t2 if FPU (Coprocessor 1) condition flag 0 is true (one)",
    },
    "movt.d": {
        syntax: "movt.d $f2, $f4",
        description:
            "Move floating point double precision : If condition flag 0 true, set double precision $f2 to double precision value in $f4",
    },
    "movt.s": {
        syntax: "movt.s $f0, $f1",
        description:
            "Move floating point single precision : If condition flag 0 is true, set single precision $f0 to single precision value in $f1e",
    },
    movz: { syntax: "movz $t1, $t2, $t3", description: "Move conditional zero : Set $t1 to $t2 if $t3 is zero" },
    "movz.d": {
        syntax: "movz.d $f2, $f4, $t3",
        description:
            "Move floating point double precision : If $t3 is zero, set double precision $f2 to double precision value in $f4",
    },
    "movz.s": {
        syntax: "movz.s $f0, $f1, $t3",
        description:
            "Move floating point single precision : If $t3 is zero, set single precision $f0 to single precision value in $f1",
    },
    msub: {
        syntax: "msub $t1, $t2",
        description:
            "Multiply subtract : Multiply $t1 by $t2 then decrement HI by high-order 32 bits of product, decrement LO by low-order 32 bits of product (use mfhi to access HI, mflo to access LO)",
    },
    msubu: {
        syntax: "msubu $t1, $t2",
        description:
            "Multiply subtract unsigned : Multiply $t1 by $t2 then decrement HI by high-order 32 bits of product, decement LO by low-order 32 bits of product, unsigned (use mfhi to access HI, mflo to access LO)",
    },
    mtc0: {
        syntax: "mtc0 $t1, $8",
        description: "Move to Coprocessor 0 : Set Coprocessor 0 register $8 to value stored in $t1",
    },
    mtc1: {
        syntax: "mtc1 $t1, $f1",
        description: "Move to Coprocessor 1 (FPU) : Set Coprocessor 1 register $f1 to value in $t1",
    },
    mthi: {
        syntax: "mthi $t1",
        description: "Move to HI registerr : Set HI to contents of $t1 (see multiply and divide operations)",
    },
    mtlo: {
        syntax: "mtlo $t1",
        description: "Move to LO register : Set LO to contents of $t1 (see multiply and divide operations)",
    },
    mul: {
        syntax: "mul $t1, $t2, $t3",
        description:
            "Multiplication without overflow : Set HI to high-order 32 bits, LO and $t1 to low-order 32 bits of the product of $t2 and $t3 (use mfhi to access HI, mflo to access LO)",
    },
    "mul.d": {
        syntax: "mul.d $f2, $f4, $f6",
        description:
            "Floating point multiplication double precision : Set $f2 to double-precision floating point value of $f4 times $f6",
    },
    "mul.s": {
        syntax: "mul.s $f0, $f1, $f3",
        description:
            "Floating point multiplication single precision : Set $f0 to single-precision floating point value of $f1 times $f3",
    },
    mult: {
        syntax: "mult $t1, $t2",
        description:
            "Multiplication : Set hi to high-order 32 bits, lo to low-order 32 bits of the product of $t1 and $t2 (use mfhi to access hi, mflo to access lo)",
    },
    multu: {
        syntax: "multu $t1, $t2",
        description:
            "Multiplication unsigned : Set HI to high-order 32 bits, LO to low-order 32 bits of the product of unsigned $t1 and $t2 (use mfhi to access HI, mflo to access LO)",
    },
    "neg.d": {
        syntax: "neg.d $f2, $f4",
        description:
            "Floating point negate double precision : Set double precision $f2 to negation of double precision value in $f4",
    },
    "neg.s": {
        syntax: "neg.s $f0, $f1",
        description:
            "Floating point negate single precision : Set single precision $f0 to negation of single precision value in $f1",
    },
    nop: { syntax: "nop", description: "Null operation : machine code is all zeroes" },
    nor: { syntax: "nor $t1, $t2, $t3", description: "Bitwise NOR : Set $t1 to bitwise NOR of $t2 and $t3" },
    or: { syntax: "or $t1, $t2, $t3", description: "Bitwise OR : Set $t1 to bitwise OR of $t2 and $t3" },
    ori: {
        syntax: "ori $t1, $t2, 100",
        description: "Bitwise OR immediate : Set $t1 to bitwise OR of $t2 and zero-extended 16-bit immediate",
    },
    "round.w.d": {
        syntax: "round.w.d $f1, $f2",
        description:
            "Round double precision to word : Set $f1 to 32-bit integer round of double-precision float in $f2",
    },
    "round.w.s": {
        syntax: "round.w.s $f0, $f1",
        description:
            "Round single precision to word : Set $f0 to 32-bit integer round of single-precision float in $f1",
    },
    sb: {
        syntax: "sb $t1, -100($t2)",
        description: "Store byte : Store the low-order 8 bits of $t1 into the effective memory byte address",
    },
    sc: {
        syntax: "sc $t1, -100($t2)",
        description:
            "Store conditional : Paired with Load Linked (ll) to perform atomic read-modify-write. Stores $t1 value into effective address, then sets $t1 to 1 for success. Always succeeds because MARS does not simulate multiple processors.",
    },
    sdc1: {
        syntax: "sdc1 $f2, -100($t2)",
        description:
            "Store double word from Coprocessor 1 (FPU)) : Store 64 bit value in $f2 to effective memory doubleword address",
    },
    sh: {
        syntax: "sh $t1, -100($t2)",
        description: "Store halfword : Store the low-order 16 bits of $t1 into the effective memory halfword address",
    },
    sll: {
        syntax: "sll $t1, $t2, 10",
        description:
            "Shift left logical : Set $t1 to result of shifting $t2 left by number of bits specified by immediate",
    },
    sllv: {
        syntax: "sllv $t1, $t2, $t3",
        description:
            "Shift left logical variable : Set $t1 to result of shifting $t2 left by number of bits specified by value in low-order 5 bits of $t3",
    },
    slt: {
        syntax: "slt $t1, $t2, $t3",
        description: "Set less than : If $t2 is less than $t3, then set $t1 to 1 else set $t1 to 0",
    },
    slti: {
        syntax: "slti $t1, $t2, -100",
        description:
            "Set less than immediate : If $t2 is less than sign-extended 16-bit immediate, then set $t1 to 1 else set $t1 to 0",
    },
    sltiu: {
        syntax: "sltiu $t1, $t2, -100",
        description:
            "Set less than immediate unsigned : If $t2 is less than sign-extended 16-bit immediate using unsigned comparison, then set $t1 to 1 else set $t1 to 0",
    },
    sltu: {
        syntax: "sltu $t1, $t2, $t3",
        description:
            "Set less than unsigned : If $t2 is less than $t3 using unsigned comparision, then set $t1 to 1 else set $t1 to 0",
    },
    "sqrt.d": {
        syntax: "sqrt.d $f2, $f4",
        description: "Square root double precision : Set $f2 to double-precision floating point square root of $f4",
    },
    "sqrt.s": {
        syntax: "sqrt.s $f0, $f1",
        description: "Square root single precision : Set $f0 to single-precision floating point square root of $f1",
    },
    sra: {
        syntax: "sra $t1, $t2, 10",
        description:
            "Shift right arithmetic : Set $t1 to result of sign-extended shifting $t2 right by number of bits specified by immediate",
    },
    srav: {
        syntax: "srav $t1, $t2, $t3",
        description:
            "Shift right arithmetic variable : Set $t1 to result of sign-extended shifting $t2 right by number of bits specified by value in low-order 5 bits of $t3",
    },
    srl: {
        syntax: "srl $t1, $t2, 10",
        description:
            "Shift right logical : Set $t1 to result of shifting $t2 right by number of bits specified by immediate",
    },
    srlv: {
        syntax: "srlv $t1, $t2, $t3",
        description:
            "Shift right logical variable : Set $t1 to result of shifting $t2 right by number of bits specified by value in low-order 5 bits of $t3",
    },
    sub: { syntax: "sub $t1, $t2, $t3", description: "Subtraction with overflow : set $t1 to ($t2 minus $t3)" },
    "sub.d": {
        syntax: "sub.d $f2, $f4, $f6",
        description:
            "Floating point subtraction double precision : Set $f2 to double-precision floating point value of $f4 minus $f6",
    },
    "sub.s": {
        syntax: "sub.s $f0, $f1, $f3",
        description:
            "Floating point subtraction single precision : Set $f0 to single-precision floating point value of $f1 minus $f3",
    },
    subu: {
        syntax: "subu $t1, $t2, $t3",
        description: "Subtraction unsigned without overflow : set $t1 to ($t2 minus $t3), no overflow",
    },
    sw: {
        syntax: "sw $t1, -100($t2)",
        description: "Store word : Store contents of $t1 into effective memory word address",
    },
    swc1: {
        syntax: "swc1 $f1, -100($t2)",
        description: "Store word from Coprocesor 1 (FPU) : Store 32 bit value in $f1 to effective memory word address",
    },
    swl: {
        syntax: "swl $t1, -100($t2)",
        description:
            "Store word left : Store high-order 1 to 4 bytes of $t1 into memory, starting with effective byte address and continuing through the low-order byte of its word",
    },
    swr: {
        syntax: "swr $t1, -100($t2)",
        description:
            "Store word right : Store low-order 1 to 4 bytes of $t1 into memory, starting with high-order byte of word containing effective byte address and continuing through that byte address",
    },
    syscall: {
        syntax: "syscall",
        description: "Issue a system call : Execute the system call specified by value in $v0",
    },
    teq: { syntax: "teq $t1, $t2", description: "Trap if equal : Trap if $t1 is equal to $t2" },
    teqi: {
        syntax: "teqi $t1, -100",
        description: "Trap if equal to immediate : Trap if $t1 is equal to sign-extended 16 bit immediate",
    },
    tge: {
        syntax: "tge $t1, $t2",
        description: "Trap if greater or equal : Trap if $t1 is greater than or equal to $t2",
    },
    tgei: {
        syntax: "tgei $t1, -100",
        description:
            "Trap if greater than or equal to immediate : Trap if $t1 greater than or equal to sign-extended 16 bit immediate",
    },
    tgeiu: {
        syntax: "tgeiu $t1, -100",
        description:
            "Trap if greater or equal to immediate unsigned : Trap if $t1 greater than or equal to sign-extended 16 bit immediate, unsigned comparison",
    },
    tgeu: {
        syntax: "tgeu $t1, $t2",
        description:
            "Trap if greater or equal unsigned : Trap if $t1 is greater than or equal to $t2 using unsigned comparision",
    },
    tlt: { syntax: "tlt $t1, $t2", description: "Trap if less than : Trap if $t1 less than $t2" },
    tlti: {
        syntax: "tlti $t1, -100",
        description: "Trap if less than immediate : Trap if $t1 less than sign-extended 16-bit immediate",
    },
    tltiu: {
        syntax: "tltiu $t1, -100",
        description:
            "Trap if less than immediate unsigned : Trap if $t1 less than sign-extended 16-bit immediate, unsigned comparison",
    },
    tltu: {
        syntax: "tltu $t1, $t2",
        description: "Trap if less than unsigned : Trap if $t1 less than $t2, unsigned comparison",
    },
    tne: { syntax: "tne $t1, $t2", description: "Trap if not equal : Trap if $t1 is not equal to $t2" },
    tnei: {
        syntax: "tnei $t1, -100",
        description: "Trap if not equal to immediate : Trap if $t1 is not equal to sign-extended 16 bit immediate",
    },
    "trunc.w.d": {
        syntax: "trunc.w.d $f1, $f2",
        description:
            "Truncate double precision to word : Set $f1 to 32-bit integer truncation of double-precision float in $f2",
    },
    "trunc.w.s": {
        syntax: "trunc.w.s $f0, $f1",
        description:
            "Truncate single precision to word : Set $f0 to 32-bit integer truncation of single-precision float in $f1",
    },
    xor: {
        syntax: "xor $t1, $t2, $t3",
        description: "Bitwise XOR (exclusive OR) : Set $t1 to bitwise XOR of $t2 and $t3",
    },
    xori: {
        syntax: "xori $t1, $t2, 100",
        description: "Bitwise XOR immediate : Set $t1 to bitwise XOR of $t2 and zero-extended 16-bit immediate",
    },
};

const pseudoInstructions: InstructionInfo = {
    abs: {
        syntax: "abs $t1, $t2",
        description: "ABSolute value : Set $t1 to absolute value of $t2 (algorithm from Hacker's Delight)",
    },
    b: { syntax: "b label", description: "Branch : Branch to statement at label unconditionally" },
    beqz: {
        syntax: "beqz $t1, label",
        description: "Branch if EQual Zero : Branch to statement at label if $t1 is equal to zero",
    },
    bge: {
        syntax: "bge $t1, $t2, label",
        description: "Branch if Greater or Equal : Branch to statement at label if $t1 is greater or equal to $t2",
    },
    bgeu: {
        syntax: "bgeu $t1, $t2, label",
        description:
            "Branch if Greater or Equal Unsigned : Branch to statement at label if $t1 is greater or equal to $t2 (unsigned compare)",
    },
    bgt: {
        syntax: "bgt $t1, $t2, label",
        description: "Branch if Greater Than : Branch to statement at label if $t1 is greater than $t2",
    },
    bgtu: {
        syntax: "bgtu $t1, $t2, label",
        description:
            "Branch if Greater Than Unsigned : Branch to statement at label if $t1 is greater than $t2 (unsigned compare)",
    },
    ble: {
        syntax: "ble $t1, $t2, label",
        description: "Branch if Less or Equal : Branch to statement at label if $t1 is less than or equal to $t2",
    },
    bleu: {
        syntax: "bleu $t1, $t2, label",
        description:
            "Branch if Less or Equal Unsigned : Branch to statement at label if $t1 is less than or equal to $t2 (unsigned compare)",
    },
    blt: {
        syntax: "blt $t1, $t2, label",
        description: "Branch if Less Than : Branch to statement at label if $t1 is less than $t2",
    },
    bltu: {
        syntax: "bltu $t1, $t2, label",
        description: "Branch if Less Than Unsigned : Branch to statement at label if $t1 is less than $t2",
    },
    bnez: {
        syntax: "bnez $t1, label",
        description: "Branch if Not Equal Zero : Branch to statement at label if $t1 is not equal to zero",
    },
    "l.d": {
        syntax: "l.d $f2, label",
        description:
            "Load floating point Double precision : Set $f2 and $f3 register pair to 64-bit value at effective memory doubleword address",
    },
    "l.s": {
        syntax: "l.s $f1, label",
        description: "Load floating point Single precision : Set $f1 to 32-bit value at effective memory word address",
    },
    la: { syntax: "la $t1, label", description: "Load Address : Set $t1 to label's address" },
    ld: {
        syntax: "ld $t1, label",
        description:
            "Load Doubleword : Set $t1 and the next register to the 64 bits starting at effective memory word address",
    },
    li: { syntax: "li $t1, 100", description: "Load Immediate : Set $t1 to a 16- or 32-bit immediate value" },
    "mfc1.d": {
        syntax: "mfc1.d $t1, $f2",
        description:
            "Move From Coprocessor 1 Double : Set $t1 to contents of $f2, set next higher register from $t1 to contents of next higher register from $f2",
    },
    move: { syntax: "move $t1, $t2", description: "MOVE : Set $t1 to contents of $t2" },
    "mtc1.d": {
        syntax: "mtc1.d $t1, $f2",
        description:
            "Move To Coprocessor 1 Double : Set $f2 to contents of $t1, set next higher register from $f2 to contents of next higher register from $t1",
    },
    mulo: {
        syntax: "mulo $t1, $t2, $t3",
        description: "MULtiplication with Overflow : Set $t1 to low-order 32 bits of the product of $t2 and $t3",
    },
    mulou: {
        syntax: "mulou $t1, $t2, $t3",
        description:
            "MULtiplication with Overflow Unsigned : Set $t1 to low-order 32 bits of the product of $t2 and $t3",
    },
    mulu: {
        syntax: "mulu $t1, $t2, $t3",
        description:
            "MULtiplication Unsigned : Set HI to high-order 32 bits, LO and $t1 to low-order 32 bits of ($t2 multiplied by $t3, unsigned multiplication)",
    },
    neg: { syntax: "neg $t1, $t2", description: "NEGate : Set $t1 to negation of $t2" },
    negu: { syntax: "negu $t1, $t2", description: "NEGate Unsigned : Set $t1 to negation of $t2, no overflow" },
    not: { syntax: "not $t1, $t2", description: "Bitwise NOT : Set $t1 to the bitwise inversion of $t2" },
    rem: { syntax: "rem $t1, $t2, $t3", description: "REMainder : Set $t1 to (remainder of $t2 divided by $t3)" },
    remu: {
        syntax: "remu $t1, $t2, $t3",
        description: "REMainder : Set $t1 to (remainder of $t2 divided by $t3, unsigned division)",
    },
    rol: {
        syntax: "rol $t1, $t2, $t3",
        description: "ROtate Left : Set $t1 to ($t2 rotated left by number of bit positions specified in $t3)",
    },
    ror: {
        syntax: "ror $t1, $t2, $t3",
        description: "ROtate Right : Set $t1 to ($t2 rotated right by number of bit positions specified in $t3)",
    },
    "s.d": {
        syntax: "s.d $f2, label",
        description:
            "Store floating point Double precision : Store 64 bits from $f2 and $f3 register pair to effective memory doubleword address",
    },
    "s.s": {
        syntax: "s.s $f1, label",
        description:
            "Store floating point Single precision : Store 32-bit value from $f1 to effective memory word address",
    },
    sd: {
        syntax: "sd $t1, label",
        description:
            "Store Doubleword : Store contents of $t1 and the next register to the 64 bits starting at effective memory word address",
    },
    seq: { syntax: "seq $t1, $t2, $t3", description: "Set EQual : if $t2 equal to $t3 then set $t1 to 1 else 0" },
    sge: {
        syntax: "sge $t1, $t2, $t3",
        description: "Set Greater or Equal : if $t2 greater or equal to $t3 then set $t1 to 1 else 0",
    },
    sgeu: {
        syntax: "sgeu $t1, $t2, $t3",
        description:
            "Set Greater or Equal Unsigned : if $t2 greater or equal to $t3 (unsigned compare) then set $t1 to 1 else 0",
    },
    sgt: {
        syntax: "sgt $t1, $t2, $t3",
        description: "Set Greater Than : if $t2 greater than $t3 then set $t1 to 1 else 0",
    },
    sgtu: {
        syntax: "sgtu $t1, $t2, $t3",
        description: "Set Greater Than Unsigned : if $t2 greater than $t3 (unsigned compare) then set $t1 to 1 else 0",
    },
    sle: {
        syntax: "sle $t1, $t2, $t3",
        description: "Set Less or Equal : if $t2 less or equal to $t3 then set $t1 to 1 else 0",
    },
    sleu: {
        syntax: "sleu $t1, $t2, $t3",
        description:
            "Set Less or Equal Unsigned : if $t2 less or equal to $t3 (unsigned compare) then set $t1 to 1 else 0",
    },
    sne: {
        syntax: "sne $t1, $t2, $t3",
        description: "Set Not Equal : if $t2 not equal to $t3 then set $t1 to 1 else 0",
    },
    subi: {
        syntax: "subi $t1, $t2, -100",
        description: "SUBtraction Immediate : set $t1 to ($t2 minus 16-bit immediate)",
    },
    subiu: {
        syntax: "subiu $t1, $t2, 100000",
        description: "SUBtraction Immediate Unsigned : set $t1 to ($t2 minus 32-bit immediate), no overflow",
    },
    ulh: {
        syntax: "ulh $t1, label",
        description:
            "Unaligned Load Halfword : Set $t1 to the 16 bits, sign-extended, starting at effective memory byte address",
    },
    ulhu: {
        syntax: "ulhu $t1, label",
        description:
            "Unaligned Load Halfword : Set $t1 to the 16 bits, zero-extended, starting at effective memory byte address",
    },
    ulw: {
        syntax: "ulw $t1, label",
        description: "Unaligned Load Word : Set $t1 to the 32 bits starting at effective memory byte address",
    },
    ush: {
        syntax: "ush $t1, label",
        description:
            "Unaligned Store Halfword : Store low-order halfword $t1 contents into the 16 bits starting at effective memory byte address",
    },
    usw: {
        syntax: "usw $t1, label",
        description:
            "Unaligned Store Word : Store $t1 contents into the 32 bits starting at effective memory byte address",
    },
};

const allInstructions: InstructionInfo = {
    ...instructions,
    ...pseudoInstructions,
};

const directives: TermInfo = {
    align: "Align next data item on specified byte boundary (0=byte, 1=half, 2=word, 3=double)",
    ascii: "Store the string in the Data segment but do not add null terminator",
    asciiz: "Store the string in the Data segment and add null terminator",
    byte: "Store the listed value(s) as 8 bit bytes",
    data: "Subsequent items stored in Data segment at next available address",
    double: "Store the listed value(s) as double precision floating point",
    end_macro: "End macro definition. See .macro",
    eqv: "Substitute second operand for first. First operand is symbol, second operand is expression (like #define)",
    extern: "Declare the listed label and byte length to be a global data field",
    float: "Store the listed value(s) as single precision floating point",
    globl: "Declare the listed label(s) as global to enable referencing from other files",
    half: "Store the listed value(s) as 16 bit halfwords on halfword boundary",
    include: "Insert the contents of the specified file. Put filename in quotes.",
    kdata: "Subsequent items stored in Kernel Data segment at next available address",
    ktext: "Subsequent items (instructions) stored in Kernel Text segment at next available address",
    macro: "Begin macro definition. See .end_macro",
    set: "Set assembler variables. Currently ignored but included for SPIM compatability",
    space: "Reserve the next specified number of bytes in Data segment",
    text: "Subsequent items (instructions) stored in Text segment at next available address",
    word: "Store the listed value(s) as 32 bit words on word boundary",
};

const registers: RegisterInfo = {
    zero: { number: 0, description: "Always holds 0. Writes to it are discarded." },
    at: { number: 1, description: "Assembler temporary, reserved for expanding pseudo-instructions." },
    v0: { number: 2, description: "Function return value, and the syscall number for `syscall`." },
    v1: { number: 3, description: "Second function return value." },
    a0: { number: 4, description: "First function argument, and the syscall argument for `syscall`." },
    a1: { number: 5, description: "Second function argument." },
    a2: { number: 6, description: "Third function argument." },
    a3: { number: 7, description: "Fourth function argument." },
    t0: { number: 8, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t1: { number: 9, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t2: { number: 10, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t3: { number: 11, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t4: { number: 12, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t5: { number: 13, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t6: { number: 14, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t7: { number: 15, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    s0: { number: 16, description: "Saved register. Callee-saved: preserved across function calls." },
    s1: { number: 17, description: "Saved register. Callee-saved: preserved across function calls." },
    s2: { number: 18, description: "Saved register. Callee-saved: preserved across function calls." },
    s3: { number: 19, description: "Saved register. Callee-saved: preserved across function calls." },
    s4: { number: 20, description: "Saved register. Callee-saved: preserved across function calls." },
    s5: { number: 21, description: "Saved register. Callee-saved: preserved across function calls." },
    s6: { number: 22, description: "Saved register. Callee-saved: preserved across function calls." },
    s7: { number: 23, description: "Saved register. Callee-saved: preserved across function calls." },
    t8: { number: 24, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    t9: { number: 25, description: "Temporary register. Caller-saved: a called function may overwrite it." },
    k0: { number: 26, description: "Reserved for the kernel's exception handler." },
    k1: { number: 27, description: "Reserved for the kernel's exception handler." },
    gp: { number: 28, description: "Global pointer, the base address of the global data area." },
    sp: { number: 29, description: "Stack pointer. Callee-saved: restore it before returning." },
    fp: { number: 30, description: "Frame pointer. Callee-saved: restore it before returning." },
    ra: { number: 31, description: "Return address, written by `jal`. Save it before making a nested call." },
};

const floatRegisters: RegisterInfo = {
    f0: { number: 0, description: "Floating-point return value." },
    f1: { number: 1, description: "Temporary floating-point register, not preserved across function calls." },
    f2: { number: 2, description: "Floating-point return value." },
    f3: { number: 3, description: "Temporary floating-point register, not preserved across function calls." },
    f4: { number: 4, description: "Temporary floating-point register, not preserved across function calls." },
    f5: { number: 5, description: "Temporary floating-point register, not preserved across function calls." },
    f6: { number: 6, description: "Temporary floating-point register, not preserved across function calls." },
    f7: { number: 7, description: "Temporary floating-point register, not preserved across function calls." },
    f8: { number: 8, description: "Temporary floating-point register, not preserved across function calls." },
    f9: { number: 9, description: "Temporary floating-point register, not preserved across function calls." },
    f10: { number: 10, description: "Temporary floating-point register, not preserved across function calls." },
    f11: { number: 11, description: "Temporary floating-point register, not preserved across function calls." },
    f12: { number: 12, description: "Floating-point function argument." },
    f13: { number: 13, description: "Temporary floating-point register, not preserved across function calls." },
    f14: { number: 14, description: "Floating-point function argument." },
    f15: { number: 15, description: "Temporary floating-point register, not preserved across function calls." },
    f16: { number: 16, description: "Temporary floating-point register, not preserved across function calls." },
    f17: { number: 17, description: "Temporary floating-point register, not preserved across function calls." },
    f18: { number: 18, description: "Temporary floating-point register, not preserved across function calls." },
    f19: { number: 19, description: "Temporary floating-point register, not preserved across function calls." },
    f20: { number: 20, description: "Saved floating-point register, preserved across function calls." },
    f21: { number: 21, description: "Saved floating-point register, preserved across function calls." },
    f22: { number: 22, description: "Saved floating-point register, preserved across function calls." },
    f23: { number: 23, description: "Saved floating-point register, preserved across function calls." },
    f24: { number: 24, description: "Saved floating-point register, preserved across function calls." },
    f25: { number: 25, description: "Saved floating-point register, preserved across function calls." },
    f26: { number: 26, description: "Saved floating-point register, preserved across function calls." },
    f27: { number: 27, description: "Saved floating-point register, preserved across function calls." },
    f28: { number: 28, description: "Saved floating-point register, preserved across function calls." },
    f29: { number: 29, description: "Saved floating-point register, preserved across function calls." },
    f30: { number: 30, description: "Saved floating-point register, preserved across function calls." },
    f31: { number: 31, description: "Saved floating-point register, preserved across function calls." },
};

export { allInstructions, directives, floatRegisters, instructions, pseudoInstructions, registers };
export type { Instruction, InstructionInfo, Register, RegisterInfo, TermInfo };
