resource "azurerm_container_registry" "container_registry" {
  name = var.app_name
  resource_group_name = azurerm_resource_group.resource_group.name

  location = var.location
  admin_enabled = true
  sku = var.sku
}

output "registry_hostname" {
  value = azurerm_container_registry.container_registry.login_server
}

output "registry_un" {
  value = azurerm_container_registry.container_registry.admin_username
}

output "registry_pw" {
  value = azurerm_container_registry.container_registry.admin_password
  sensitive = true
}