var img = require("heatshrink").decompress(atob("mEwhAZWldWJNov/F/4v/F/4v/F/4v/F/4v/F/4v/F/4v/F/4vzlcrF6ITBAA4uQwPX6+BF54TCAA4bJEIwUDQpAvFCYgAHUJwvvPYesR7QbJAA9WIJTvHCYIAHFyCdND7wv/F/4v/F/4v/F/4v/F/4v/F/4v/F/4v/F/4v4A"));

function drawImg (pokemon) {
  g.clear();
  g.drawImage( pokemon, 20, 20, {scale: 1});
}

drawImg(img);
