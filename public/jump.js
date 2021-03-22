window.__init_hash__ = location.hash;
window.onload = function () {
  setTimeout(
    function (hash) {
      console.log("jump to " + hash + "!");
      location.hash = hash;
    },
    0,
    __init_hash__
  );
};
