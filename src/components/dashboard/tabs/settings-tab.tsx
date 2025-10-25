'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SettingsAccountState } from '../settings/settings-account-state';
import { SettingsAppearance } from '../settings/settings-appearance';
import { SettingsBilling } from '../settings/settings-billing';
import { SettingsDangerZone } from '../settings/settings-danger-zone';
import { SettingsIntegrations } from '../settings/settings-integrations';
import { SettingsNotifications } from '../settings/settings-notifications';
import { SettingsOrganization } from '../settings/settings-organization';
import { SettingsSecurity } from '../settings/settings-security';
import { SettingsTeam } from '../settings/settings-team';
import { SettingsWallets } from '../settings/settings-wallets';

export function SettingsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your organization and preferences</p>
      </div>

      {/* Settings tabs */}
      <Tabs defaultValue="organization" className="w-full">
        <TabsList className="grid w-full grid-cols-2 overflow-x-auto md:grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="organization" className="text-xs md:text-sm">
            Organization
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm">
            Security
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs md:text-sm">
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-xs md:text-sm">
            Billing
          </TabsTrigger>
          <TabsTrigger value="wallets" className="text-xs md:text-sm">
            Wallets
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs md:text-sm">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs md:text-sm">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs md:text-sm">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account-state" className="text-xs md:text-sm">
            Account State
          </TabsTrigger>
          <TabsTrigger value="danger" className="text-xs md:text-sm">
            Danger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <SettingsOrganization />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SettingsSecurity />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <SettingsTeam />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <SettingsBilling />
        </TabsContent>

        <TabsContent value="wallets" className="space-y-4">
          <SettingsWallets />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <SettingsNotifications />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <SettingsIntegrations />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <SettingsAppearance />
        </TabsContent>

        <TabsContent value="account-state" className="space-y-4">
          <SettingsAccountState />
        </TabsContent>

        <TabsContent value="danger" className="space-y-4">
          <SettingsDangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
