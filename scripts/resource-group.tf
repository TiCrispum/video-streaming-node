resource "azurerm_resource_group" "resource_group" {
  name     = var.app_name
  location = var.location
}