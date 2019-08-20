<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Online Assignment</title>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
  <!-- Bootstrap core CSS -->
  <link href="../assets/css/bootstrap.min.css" rel="stylesheet">
  <!-- Online Assignment -->
  <link href="../assets/css/mdb.min.css" rel="stylesheet">
  <!-- Your custom styles (optional) -->
  <link href="../assets/css/style.min.css" rel="stylesheet">
</head>

<body class="grey lighten-3">

  <?php include "partials/header.php"; ?>

  <!--Main layout-->
  <main class="pt-5 mx-lg-5">
    <div class="container-fluid mt-5">

      <!-- Heading -->
      <div class="card mb-4 wow fadeIn">

        <!--Card content-->
        <div class="card-body d-sm-flex justify-content-between">

          <h4 class="mb-2 mb-sm-0 pt-1">
            <a href="https://mdbootstrap.com/docs/jquery/" >Home Page</a>
            <span>/</span>
            <span>My Students</span>
          </h4>

          <section class="d-flex justify-content-center">
            <!-- Default input -->
            <button type="button" class="btn btn-primary">View Submitted Assignment</button>
          </section>

        </div>

      </div>
      <!-- Heading -->

      <!--Grid row-->
      <div class="row wow fadeIn">
        <div class="col-md-9 mb-4">
          <div class="card">
            <div class="card-header text-left">
                Student List
            </div>
            <div class="card-body">
            <form action="">
            <div class="form-row mb-4">
         <div class="col">
            <!-- First name -->
            <input type="text" id="defaultRegisterFormFirstName" class="form-control" placeholder="First name">
        </div>
        <div class="col">
            <!-- Last name -->
            <input type="text" id="defaultRegisterFormLastName" class="form-control" placeholder="Last name">
        </div>
    </div>
            </form>
            <table class="table table-hover">
                <!-- Table head -->
                <thead class="blue-grey lighten-4">
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Matric Number</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <!-- Table head -->

                <!-- Table body -->
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Cell 1</td>
                    <td>Cell 2</td>
                    <td>Cell 3</td>   
                  </tr>
                  <tr>
                </tbody>
                <!-- Table body -->
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-4">

          <!--Card-->
          <div class="card mb-4">

            <!--Card content-->
            <div class="card-body">

              <!-- List group links -->
              <div class="list-group list-group-flush">
                <a class="list-group-item list-group-item-action waves-effect">Completed Assignment
                  <span class="badge badge-success badge-pill pull-right">22%
                    <i class="fas fa-arrow-up ml-1"></i>
                  </span>
                </a>
                <a class="list-group-item list-group-item-action waves-effect">Pending Assignment
                  <span class="badge badge-danger badge-pill pull-right">5%
                    <i class="fas fa-arrow-down ml-1"></i>
                  </span>
                </a>
                <a class="list-group-item list-group-item-action waves-effect">Students
                  <span class="badge badge-primary badge-pill pull-right">14</span>
                </a>
                <a class="list-group-item list-group-item-action waves-effect">Courses
                  <span class="badge badge-primary badge-pill pull-right">123</span>
                </a>
                <a class="list-group-item list-group-item-action waves-effect">Assignment
                  <span class="badge badge-primary badge-pill pull-right">8</span>
                </a>
              </div>
              <!-- List group links -->

            </div>

          </div>
          <!--/.Card-->

        </div>
      </div>

    </div>
  </main>

  <!--Main layout-->

  <?php include 'partials/footer.php'; ?>

</html>
