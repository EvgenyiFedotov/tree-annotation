const { watch } = require("gulp");
const { exec } = require("child_process");

const index = cb => {
  exec("node index.js");
  if (cb) cb();
};

function defaultTask(cb) {
  watch(["index.js", "lib/**/*.js"], index);

  index();
  cb();
}

exports.default = defaultTask;
