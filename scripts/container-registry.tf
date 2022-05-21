resource "azurerm_container_registry" "ticrispum_cr" {
  name = var.app_name
  resource_group_name = azurerm_resource_group.ticrispum_rg.name

  location = var.location
  admin_enabled = true
  sku = var.sku
}

output "registry_hostname" {
  value = azurerm_container_registry.ticrispum_cr.login_server
}

output "registry_un" {
  value = azurerm_container_registry.ticrispum_cr.admin_username
}

output "registry_pw" {
  value = azurerm_container_registry.ticrispum_cr.admin_password
  sensitive = true
}