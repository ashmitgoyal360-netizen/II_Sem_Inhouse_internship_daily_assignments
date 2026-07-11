

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">

<h1>Registration Successful</h1>

<?php

$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$phone = $_POST['phone'];
$gender = $_POST['gender'];
$address = $_POST['address'];

if(isset($_POST['hobbies'])){
    $hobbies = implode(", ", $_POST['hobbies']);
}
else{
    $hobbies = "No Hobbies Selected";
}

echo "<p><b>Name :</b> $name</p>";
echo "<p><b>Email :</b> $email</p>";
echo "<p><b>Password :</b> $password</p>";
echo "<p><b>Phone :</b> $phone</p>";
echo "<p><b>Gender :</b> $gender</p>";
echo "<p><b>Hobbies :</b> $hobbies</p>";
echo "<p><b>Address :</b> $address</p>";

?>

<br>

<a href="index.php">
    <button>Go Back</button>
</a>

</div>

</body>
</html>