<?php

function url_tools__request($url, $timeout=10, $headers=array()) {
  /* Returns results of calling a given $url with a $timeout and optional $headers. */

  //dpm($url);
  //dpm($headers);

  // make cURL request; return results.
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //suppress output.
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $ch_exec = curl_exec($ch);

  //dpm($ch_exec);

  curl_close($ch);
  return $ch_exec;
}

?>