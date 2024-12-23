use core::nullable::{NullableTrait};
use core::fmt::{Debug, Formatter, Error};
use core::ops::Deref;
use super::BinaryTree;

pub(crate) impl DebugBinaryTree of Debug<BinaryTree> {
    fn fmt(self: @BinaryTree, ref f: Formatter) -> Result<(), Error> {
        fmt_helper(self, ref f, 0, true)
    }
}

fn fmt_helper(
    self: @BinaryTree, ref f: Formatter, depth: usize, is_last: bool,
) -> Result<(), Error> {
    let mut indent: ByteArray = "";
    let mut i = 0;
    loop {
        if i == depth {
            break;
        }
        indent += if i == depth - 1 && is_last {
            "    "
        } else {
            "|   "
        };
        i += 1;
    };

    let branch: ByteArray = if is_last {
        "`-- "
    } else {
        "|-- "
    };

    match self {
        BinaryTree::Leaf(value) => { writeln!(f, "{}{}{:?}", indent, branch, *value) },
        BinaryTree::Node(node) => {
            let (value, left, right) = node;
            let left_node = (*left).deref();
            let right_node = (*right).deref();
            writeln!(f, "{}{}{:?}", indent, branch, *value)?;
            fmt_helper(@left_node, ref f, depth + 1, false)?;
            fmt_helper(@right_node, ref f, depth + 1, true)
        },
    }
}
