resource "azurerm_kubernetes_cluster" "cluster" {
  name = var.app_name
  location = var.location
  resource_group_name = azurerm_resource_group.resource_group.name
  dns_prefix = var.app_name
  kubernetes_version = var.kubernetes_version

  linux_profile {
    admin_username = var.admin_username
    ssh_key {
      key_data = "${trimspace(tls_private_key.key.public_key_openssh)} ${var.admin_username}@azure.com"
    }
  }

  default_node_pool {
    name    = var.kubernetes_cluster_default_node_pool_name
    node_count = var.kubernetes_cluster_default_node_pool_node_count
    vm_size = var.kubernetes_cluster_default_node_pool_vm_size
  }

  service_principal {
    client_id     = var.client_id
    client_secret = var.client_secret
  }
}

output "cluster_client_key" {
  value = azurerm_kubernetes_cluster.cluster.kube_config[0].client_key
  sensitive = true
}

output "cluster_client_certificate" {
  value = azurerm_kubernetes_cluster.cluster.kube_config[0].client_certificate
  sensitive = true
}

output "cluster_client_ca_certificate" {
  value = azurerm_kubernetes_cluster.cluster.kube_config[0].cluster_ca_certificate
  sensitive = true
}

output "cluster_username" {
  value = azurerm_kubernetes_cluster.cluster.kube_config[0].username
  sensitive = true
}

output "cluster_password" {
  value = azurerm_kubernetes_cluster.cluster.kube_config[0].password
  sensitive = true
}

output "cluster_kube_config" {
  value = azurerm_kubernetes_cluster.cluster.kube_config_raw
  sensitive = true
}

output "cluster_host" {
  value = azurerm_kubernetes_cluster.cluster.kube_config[0].host
  sensitive = true
}