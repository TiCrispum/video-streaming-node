variable "app_name" {
  default = "ticrispum"
}

variable "app_version" {
}

variable location {
  default = "France Central"
}

variable admin_username {
  default = "linux_admin"
}

variable kubernetes_version {
  default = "1.23.5"
}

variable kubernetes_cluster_default_node_pool_name {
  default = "default"
}

variable kubernetes_cluster_default_node_pool_node_count {
  default = 1
}

variable kubernetes_cluster_default_node_pool_vm_size {
  default = "Standard_B2ms"
}


variable sku {
  default = "Basic"
}

variable client_id {

}

variable client_secret {

}