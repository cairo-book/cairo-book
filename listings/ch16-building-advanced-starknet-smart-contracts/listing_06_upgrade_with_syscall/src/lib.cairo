use starknet::{ClassHash, syscalls};
use starknet::class_hash::class_hash_const;

fn _upgrade(new_class_hash: ClassHash) {
    assert(new_class_hash != class_hash_const::<0>(), 'Class hash cannot be zero');
    syscalls::replace_class_syscall(new_class_hash).unwrap();
}
