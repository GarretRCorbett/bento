<?php

function similarity_tools__calculate_similarity($string_1, $string_2, $sorted=0, $stopwords_csv=Null) {
  /* Returns a text similarity score between two strings; ignores word order if $sorted = 1; 
    weighs comparison with/without optional comma-separated words in $stopwords_csv and uses the
    higher score. */
  
  // anonymous function to clean up strings.
  $clean_string = function($string_x) {
    
    // replace "+" sign with whitespace and remove duplicate whitespace.
    $string_x = str_replace("+", " ", $string_x);
    $string_x = strtolower(preg_replace("/\s+/", " ", $string_x));
    
    // remove leading/trailing quotes if both are present (e.g. "kittens" == kittens == 'kittens').
    if (substr($string_x, 0, 1) == '"' && substr($string_x, -1) == '"') {
      $string_x = substr($string_x, 1, strlen($string_x) - 2);
    }
    elseif (substr($string_x, 0, 1) == "'" && substr($string_x, -1) == "'") {
      $string_x = substr($string_x, 1, strlen($string_x) - 2);
    }
    
    // encode HTML characters, trim string.
    $string_x = htmlspecialchars($string_x, ENT_QUOTES, Null, False);
    $string_x = trim($string_x);
    return $string_x;
  };
  
  // anonymous function to sort strings alphabetically.
  $sort_string = function($string_x) {
    $string_x = explode(" ", $string_x);
    natcasesort($string_x);
    $string_x = implode(" ", $string_x);
    return $string_x;
  };
  
  // clean input strings with $slean_string().
  $string_1 = $clean_string($string_1);
  $string_2 = $clean_string($string_2);
  
  // if $sorted = 1, then sort both strings with $sort_string().
  if ($sorted == 1) {
    $string_1 = $sort_string($string_1);
    $string_2 = $sort_string($string_2);
  }
  
  // skip comparison if either string is less than 4 characters.
  if (strlen($string_1) < 4 || strlen($string_2) < 4) {
    $result = 0; 
  }
  else {
    // calculate similarity between strings.
    $sim_text = similar_text($string_1, $string_2, $result);
    
    // calculate similarity between strings with stopwords removed.
    if ($stopwords_csv != Null) {
      $stopwords = explode(",", $stopwords_csv);
      $string_1 = str_ireplace($stopwords, "", $string_1);
      $string_2 = str_ireplace($stopwords, "", $string_2);
      $string_1 = $clean_string($string_1); //removes whitespace leftover by str_ireplace().
      $string_2 = $clean_string($string_2);
      $sim_text = similar_text($string_1, $string_2, $temp_result);
      
      // return higher similarity score (if stopwords were used).
      if ($temp_result > $result) {
        $result = $temp_result;
      }
    }
  }
  
  // return score within range 0 to 1 (perfect similarity score).
  $score = $result/100;
  $score = sprintf("%0.2f", $score);
  return $score;
}

?>