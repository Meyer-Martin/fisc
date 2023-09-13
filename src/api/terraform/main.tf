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
  access_key = "SCWDZK03AAC657F8S8E1"
  secret_key = "36e44f90-4669-47ec-ae6e-3a39d2c5d139"
}

variable "project_id" {
  type        = string
  default     = "b0372300-1fb2-412d-9fb4-64e8891c7914"
}

variable "vm_name_pfx" {
  description = "VM Names"
  default     = "nextcloud-server-"
  type        = string
}

variable "vm_size" {
  description = "VM Size"
  default     = 20
  type        = number
}

variable "vm_count" {
  description = "Number of Virtual Machines"
  default     = 1
  type        = number
}

resource "scaleway_instance_ip" "ip" {
  project_id  = var.project_id
  count       = var.vm_count
}

data "scaleway_instance_image" "nextcloud_s" {
  project_id  = var.project_id
  image_id    = "ca7f8f8b-9812-4ece-a9ed-c1f72fa51902"
}

resource "scaleway_instance_server" "nextcloud-server" {
  count       = var.vm_count # Count Value read from variable
  name        = "${var.vm_name_pfx}-${count.index}"
  ip_id       = scaleway_instance_ip.ip[count.index].id
  image       = data.scaleway_instance_image.nextcloud_s.id
  type        = "DEV1-S"
  security_group_id = scaleway_instance_security_group.web.id
  project_id  = var.project_id
  root_volume {
    volume_type = "b_ssd"
    size_in_gb = var.vm_size
  }
}

resource "scaleway_instance_security_group" "web" {
  name           = "http"
  description    = "allow HTTP and HTTPS traffic"
  project_id     = var.project_id

  inbound_rule {
    action       = "accept"
    port         = 80
    ip_range     = "0.0.0.0/0"
    protocol     = "TCP"
  }

  inbound_rule {
    action       = "accept"
    port         = 443
    ip_range     = "0.0.0.0/0"
    protocol     = "TCP"
  }
}