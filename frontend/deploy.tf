provider "google" {
  project = "" #add your project name
  region  = "" #add your region name
}

resource "google_cloud_run_service" "default" {
  name     = "" #add cloud run service name
  location = "" #add location

  template {
    spec {
      containers {
        image = "docker.io/kaushikdhola02/sample:latest" #replace with yours Jaishankar

        ports {
          container_port = 443
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "noauth" {
  service    = google_cloud_run_service.default.name
  location   = google_cloud_run_service.default.location
  role       = "roles/run.invoker"
  member     = "allUsers"
}

output "cloud_run_url" {
  value = google_cloud_run_service.default.status[0].url
}
