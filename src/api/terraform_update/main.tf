terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
    }
  }
  required_version = ">= 0.13"
}

provider "scaleway" {
  zone       = "fr-par-2"
  region     = "fr-par"
  access_key = "SCWD19AN13E8F4MJX8R8"
  secret_key = "7b3ed065-474d-42b9-a982-906eec716bfa"
}

variable "project_id" {
  type        = string
  default     = "b0372300-1fb2-412d-9fb4-64e8891c7914"
}

data "scaleway_instance_image" "nextcloud_s" {
  project_id  = var.project_id
  image_id    = "ca7f8f8b-9812-4ece-a9ed-c1f72fa51902"
}

variable "vm_name_pfx" {
  description = "VM Names"
  default     = "nextcloud-server-"
  type        = string
}

variable "new_vm_size" {
  description = "VM Size"
  default     = 20
  type        = number
}

resource "scaleway_instance_server" "nextcloud-server" {
  name        = "${var.vm_name_pfx}"
  type        = "DEV1-S"
  image       = data.scaleway_instance_image.nextcloud_s.id
  project_id  = var.project_id
  root_volume {
    volume_type = "b_ssd"
    size_in_gb = var.new_vm_size
  }
}

resource "scaleway_instance_volume_attach" "example" {
  server_id    = a44b1ec0-a613-49af-bab7-71c87d5e953b # Utilisez l'ID de votre instance
  volume_id    = c3eb1096-1ddb-402f-b149-0ef83244d888  # Utilisez l'ID de votre volume
  device_name  = "nextcloud_s-snapshot"  # Nom du dispositif
}