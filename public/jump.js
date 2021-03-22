setTimeout(
  function (hash) {
    console.log("jump to " + hash + "!");
    location.hash = hash;
  },
  0,
  location.hash
);
