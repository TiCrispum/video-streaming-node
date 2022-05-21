resource "azurerm_container_registry" "ticrispum" {
  name = "ticrispum"
  resource_group_name = azurerm_resource_group.ticrispum.name

  location = "francecentral"
  admin_enabled = true
  sku = "Basic"
}

output "registry_hostname" {
  value = azurerm_container_registry.ticrispum.login_server
}

output "registry_un" {
  value = azurerm_container_registry.ticrispum.admin_username
}

output "registry_pw" {
  value = azurerm_container_registry.ticrispum.admin_password
  sensitive = true
}