<?php

function query_tools__query_cleaner($text) {
  /* Returns an array of sanitized queries and query type (advanced|basic) upon analysis of $text. */
  
  // start with the assumption of a basic query.
  $query_type = "basic";
  
  // remove empty double quotes and parenthesis.
  $text = str_replace('""', "", $text);
  $text = str_replace("()", "", $text);
  
  // if the number of double quotes is not even, then penalize the query by lower-casing the query
  // and removing all double quotes.
  $test_double_quotes = (substr_count($text, '"')) % 2;
  if ($test_double_quotes > 0) {
    $text = strtolower($text);
    $text = str_replace('"', "", $text);
  };
  
  // if the number of opening and closing parenthesis don't match, then penalize the query by
  //lower-casing the query and removing all parenthesis.
  if (substr_count($text, "(") !== substr_count($text, ")")) {
    $text = strtolower($text);
    $text = str_replace(array("(", ")"), "", $text);
  }
  
  // trim query; remove duplicate whitespace.
  // this must be done after replacing extraneous double quotes and parenthesis so that a query
  // starting with either would get trimmed.
  $text = trim($text);
  $text = preg_replace("/\s+/", " ", $text);
  
  // if $text is all CAPS then penalize the query by lower-casing the query.
  if (strtoupper($text) == $text) {
    $text = strtolower($text);
  };
  
  // determine if first and/or last word in query hints at a faux-advanced query.
  $operators = array("AND", "OR", "NOT");
  $words = explode(" ", $text);
  
  // lower-case first word if in $operators.
  if (in_array($words[0], $operators)) {
    $words[0] = strtolower($words[0]);
  }
  
  // lower-case last word if in $operators.
  if (in_array(end($words), $operators)) {
    $words[count($words)-1] = strtolower(end($words));
  }
  
  // put $text back together again ... all the King's horses and all the King's men.
  $text = implode($words, " ");
  
  // determine if query is "advanced" or "basic".
  $operators = array(" AND ", " OR ", " NOT ");
  
  // if words in query are in $operators; then query is advanced.
  foreach ($operators as $operator) {
    $pos = strpos($text, $operator);
    if ($pos !== False) {
      $query_type = "advanced";
      break;
    }
  }
  
  // create empty array for all parts of query.
  $query = array();
  
  // split query at whitespace with double quote enclosure; add query parts to $query.
  $splits = (str_getcsv($text, " ", '"'));
  foreach ($splits as $split) {
    if (strpos($split, " ") !== False) {
      $split = '"' . $split . '"';
    }
    array_push($query, $split);
  }
     
  // create empty output array.
  $query_array= array();
  
  // add query type to output along with keys for Solr and SQLite search engines.
  $query_array["type"] = $query_type;
  $query_array["solr"] = Null;
  $query_array["sqlite"] = Null;
   
  // prepare and escape "exact" query string for different search engines.
  $query_string = implode(" ", $query);
  $query_array["solr"]["exact"] = str_replace(" ", "+", $query_string);  
  $query_array["solr"]["exact"] = string_tools__escape_solr_chars($query_array["solr"]["exact"]);
  $query_array["sqlite"]["exact"] = str_replace("'", "''", $query_string);
  $query_array["sqlite"]["exact"] = string_tools__escape_sqlite_chars($query_array["sqlite"]["exact"]);
  
  // create AND and OR separated versions of query string if query type is "basic".
  if ($query_type == "basic") { 
    
    // create Solr versions of query.
    $query_solr = str_replace(" ", "+", $query);
    $query_solr = array_map('strtolower', $query_solr);
    $query_solr = array_map('string_tools__escape_solr_chars', $query_solr);
    $query_array["solr"]["and"] = implode("+AND+", $query_solr);
    $query_array["solr"]["or"] = implode("+OR+", $query_solr);
    
    // Create SQLite versions of query.
    // AND/OR/NOT operators require support for Enhanced Query Syntax; see: http://www.sqlite.org/fts3.html#section_3_1
    $query_sqlite = str_replace("'", "''", $query);
    $query_sqlite = array_map('strtolower', $query_sqlite);
    $query_sqlite = array_map('string_tools__escape_sqlite_chars', $query_sqlite);
    $query_array["sqlite"]["and"] = string_tools__implode(" AND ", $query_sqlite);
    $query_array["sqlite"]["or"] = string_tools__implode(" OR ", $query_sqlite);    

  }
  
  //print_r($query_array); //test line.
  return $query_array;
}

?>