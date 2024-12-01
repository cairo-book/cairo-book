// ANCHOR: full
use core::circuit::{
    CircuitElement, CircuitInput, circuit_add, circuit_mul, EvalCircuitTrait, CircuitOutputsTrait,
    CircuitModulus, AddInputResultTrait, CircuitInputs, u384,
};

// Circuit: a * (a + b)
// witness: a = 10, b = 20
// expected output: 10 * (10 + 20) = 300
fn eval_circuit() -> (u384, u384) {
    // ANCHOR: inputs
    let a = CircuitElement::<CircuitInput<0>> {};
    let b = CircuitElement::<CircuitInput<1>> {};
    // ANCHOR_END: inputs

    // ANCHOR: description
    let add = circuit_add(a, b);
    let mul = circuit_mul(a, add);
    // ANCHOR_END: description

    // ANCHOR: output
    let output = (mul,);
    // ANCHOR_END: output

    // ANCHOR: instance
    let mut inputs = output.new_inputs();
    inputs = inputs.next([10, 0, 0, 0]);
    inputs = inputs.next([20, 0, 0, 0]);

    let instance = inputs.done();
    // ANCHOR_END: instance

    // ANCHOR: modulus
    let bn254_modulus = TryInto::<
        _, CircuitModulus,
    >::try_into([0x6871ca8d3c208c16d87cfd47, 0xb85045b68181585d97816a91, 0x30644e72e131a029, 0x0])
        .unwrap();
    // ANCHOR_END: modulus

    // ANCHOR: eval
    let res = instance.eval(bn254_modulus).unwrap();
    // ANCHOR_END: eval

    // ANCHOR: output_values
    let add_output = res.get_output(add);
    let circuit_output = res.get_output(mul);

    assert(add_output == u384 { limb0: 30, limb1: 0, limb2: 0, limb3: 0 }, 'add_output');
    assert(circuit_output == u384 { limb0: 300, limb1: 0, limb2: 0, limb3: 0 }, 'circuit_output');
    // ANCHOR_END: output_values

    (add_output, circuit_output)
}
// ANCHOR_END: full

fn main() {
    eval_circuit();
}
