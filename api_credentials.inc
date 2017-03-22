<?php
function getCredentials($type) {

  switch ($type) {
    case 'OCLC__wskey':
    return 'place_your_university_information_here';
    break;

    case 'SUMMON__api_id':
    return 'place_your_university_information_here';
    break;

    case 'SUMMON__api_key':
    return 'place_your_university_information_here';
    break;

    default:
    return 'UNKNOWN';
    break;
  }
}
