resource "azurerm_resource_group" "ticrispum_rg" {
  name     = var.app_name
  location = var.location
}