import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { CascadeUiProgramExplorerLink } from './ui/cascade-ui-program-explorer-link'
import { CascadeUiCreate } from './ui/cascade-ui-create'
import { CascadeUiProgram } from '@/features/cascade/ui/cascade-ui-program'

export default function CascadeFeature() {
  const { account } = useSolana()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletDropdown />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppHero title="Cascade" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <CascadeUiProgramExplorerLink />
        </p>
        <CascadeUiCreate account={account} />
      </AppHero>
      <CascadeUiProgram />
    </div>
  )
}
