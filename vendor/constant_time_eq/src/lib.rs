#![cfg_attr(not(feature = "std"), no_std)]

/// Constant-time equality check for two byte slices.
///
/// Returns `true` if `a` and `b` have the same length and contents, `false` otherwise.
/// Runs in time dependent only on the length of the inputs, not their contents.
pub fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }

    let mut diff: u8 = 0;
    for (&x, &y) in a.iter().zip(b.iter()) {
        diff |= x ^ y;
    }
    diff == 0
}


