<?php 

# the directory (relative to this file) that holds the slides
$dir = "./data"; 

# the array will hold all the image addresses
$result = array();

# get all the files in the specified directory
$files = scandir($dir);

foreach($files as $file) 
{
	switch (ltrim(strstr($file, '.'), '.'))
	{
		# if the file is an image, add it to the array
		case 'jpg': case 'JPG': case 'jpeg': case 'JPEG': case 'png': case 'gif': 
		# code
		$result[] = $dir . "/" . $file;
		break;
	}
}

# convert the array into JSON
$resultJson = json_encode($result);

# output the JSON object
# this is what the AJAX request will see
echo($resultJson);

?>