<?php

function string_tools__truncate($blob, $limit=50) {
  /* Returns $blob as a $snippet truncated to $limit words. */
  
  //reduce duplicate whitespace.
  $snippet = preg_replace("/\s+/", " ", $blob);
  
  // split string.
  $snippet = explode(" ", $snippet);
  
  // only condense if $blob length is greater than $snippet length.
  if (count($snippet) >= $limit ) {
    $snippet = array_slice($snippet, 0, $limit);
    $snippet = implode(" ", $snippet);
    
    // remove last character if not alphanumeric.
    if (ctype_alnum(substr($snippet, -1)) !=True) {
      $snippet = substr($snippet, 0, -1);
    }
    
    // add ellipsis if last character not a period.
    $ellipsis = " ...";
    if (substr($snippet, -1, 1) != ".") {
      $snippet = $snippet . $ellipsis;
    }
  }
  else {
    $snippet = implode(" ", $snippet);
  }
  
  return $snippet;
}


function string_tools__implode($operator, $arr) {
  /* Returns array to string (like implode()) but items that are not Null or empty are returned. */
  
  // anonymous function to return only non-Null, non-blank items.
  $remove_empties = function($item) {
    $item_test = preg_replace("/([^a-zA-Z0-9])/", Null, $item);
    if($item_test != Null && $item_test != " ") {
      return $item;
    }
  };
  
  // cleanse array and implode by $operator if array length > 1.
  $arr = array_filter($arr, $remove_empties);    
  if (count($arr) > 1) {
    $arr = implode($operator, $arr);
  }
  else {
    $arr = implode("", $arr);
  }
  return $arr;
}


function string_tools__escape_solr_chars($query) {
  /* Returns escaped Solr query string. */
  
  // <!-- $reserved = '+-&|!(){}[]^"~*?:\\'; //list from: "http://www.php.net/manual/en/solrutils.escapequerychars.php#112864". -->
  $reserved = '-&|!(){}[]^"~*?:\\'; //as above with "+" removed as that's needed to represent whitespace.

  // replace problem characters; return new $query.
  $query = str_replace("%", "%25", $query); //this MUST be done first to avoid double-percent-encoding.
  $query = str_replace("&", "%26", $query);
  $query = str_replace(array("{","}"), "", $query);
  return addcslashes($query, $reserved);
}


function string_tools__escape_sqlite_chars($query) {
  /* Returns SQLite $query string with whitespace added between adjacent non-alphanumeric characters.
     Also removes basic stopwords. */

  // custom case-insensitive and case-sensitive stopwords.
  // for a light list of stopwords see: "http://wiki.apache.org/solr/AnalyzersTokenizersTokenFilters#solr.StopFilterFactory".
  $stopwords = array("a", "an", "the", "but", "nor");
  $stopwords_case_sensitive = array("and", "or", "not");
  
  // replace stopwords words only, per "http://stackoverflow.com/a/3426309".
  foreach ($stopwords as $stopword) {
    $query = preg_replace("/\b$stopword\b/i", "", $query); //case-insensitive.
  }
  foreach ($stopwords_case_sensitive as $stopword) {
    $query = preg_replace("/\b$stopword\b/", "", $query); //case-sensitive.
  }

  // replace certain non-alphanumerics with whitespace.
  $replacer = function($q) {
    $q = preg_replace("/([^a-zA-Z0-9\s\'\"\?\!\.])/", " ", $q);
    return $q;
  };
  
  // run $replacer() until no adjacent non-alphanumeric characters remain.
  while ($query != $replacer($query)) {
    $query = $replacer($query);
  }
  
  // remove duplicate whitespace; return new $query.
  $query = preg_replace("/\s+/", " ", $query);
  $query = trim($query);
  return $query;
}

?>