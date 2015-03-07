# Date-Time-Picker-Relational-Slider-
This date time picker desing as set of related whells

This datetimepicker for mobile use, allows assigment of lower level by controlling upper level.

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.ico">

    <title>Dashboard Template for Bootstrap</title>

    <!-- Bootstrap core CSS -->
    <link href="Assets/bootstrap.css" rel="stylesheet">
	<link href="Assets/horeca-tech-date-time-picker.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="Assets/dashboard.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy this line! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand">Curriculum vitae</a>
        </div>
        <div class="navbar-collapse collapse">
          <form enctype="multipart/form-data" class="navbar-form navbar-right">
            <input type="file" name="file" class="form-control">
          </form>
          <ul class="nav navbar-nav navbar-right">
            <li><a id="save">Save</a></li> <!-- for saving changes when all necessary data filled -->
            <li><a id="delete">Delete</a></li> <!-- for deleting existing CV -->
            <li><a id="mode">Edit</a></li> <!-- mode Edit / View -->
            <li><a id="reload">Reload</a></li> <!-- for reloading CV from source: db or XML file if data was changed -->
            <li><a id="copy">Copy</a></li> <!-- for coping of existing in db CV to create another, only if no changes are made to original-->
            <li><a id="new">New</a></li> <!-- for blank CV loading -->
          </ul>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar" id="cv_list"></ul>
        </div>
        <div id="cv_page" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main"></div>
      </div>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="Assets/jquery-2.0.0.js"></script>
    <script src="Assets/bootstrap.js"></script>
    <script src="Assets/horeca-tech-date-time-picker.js"></script>
	<script src="Assets/horeca-tech-typeahead.js"></script>
    <script src="cv.js"></script>
  </body>
</html>
