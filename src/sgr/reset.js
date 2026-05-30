const makeReset = (enabled = true) => enabled ? "\x1b[0m" : "";

module.exports = {makeReset};