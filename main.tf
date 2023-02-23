terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
    }
  }
  required_version = ">= 0.13"
}

provider "scaleway" {
  zone   = "fr-par-2"
  region = "fr-par"
  access_key = "SCWD19AN13E8F4MJX8R8"
  secret_key = "7b3ed065-474d-42b9-a982-906eec716bfa"
}

variable "project_id" {
  type        = string
  default  = "2548c189-3774-46a1-8a18-e0ef516d5893"
}

variable "vm_name_pfx" {
  description = "VM Names"
  default     = "nextcloud-server-"
  type        = string
}

variable "vm_count" {
  description = "Number of Virtual Machines"
  default     = 1
  type        = string
}

resource "scaleway_instance_ip" "ip" {
  project_id = var.project_id
  count = var.vm_count
  name = "${var.vm_name_pfx}-${count.index}-ip"
}

data "scaleway_instance_image" "nextcloud_s" {
  architecture = "x86_64"
  name         = "Nextcloud_s"
  project_id = var.project_id
  image_id = ""
}

resource "scaleway_instance_server" "nextcloud-server" {
  count = var.vm_count # Count Value read from variable
  name  = "${var.vm_name_pfx}-${count.index}"
  ip_id = scaleway_instance_ip.ip[count.index].id
  image = data.scaleway_instance_image.nextcloud_s.id
  type  = "DEV1-S"
  security_group_id = scaleway_instance_security_group.web.id
  project_id = var.project_id
}

resource "scaleway_instance_security_group" "web" {
  name        = "http"
  description = "allow HTTP and HTTPS traffic"
  project_id = var.project_id

  inbound_rule {
    action = "accept"
    port = 80
    ip_range = "0.0.0.0/0"
    protocol = "TCP"
  }

  inbound_rule {
    action = "accept"
    port = 443
    ip_range = "0.0.0.0/0"
    protocol = "TCP"
  }
}
