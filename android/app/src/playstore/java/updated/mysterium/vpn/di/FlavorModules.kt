package updated.mysterium.vpn.di

import org.koin.android.ext.koin.androidApplication
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module
import updated.mysterium.vpn.ui.top.up.play.billing.amount.usd.PlayBillingAmountUsdViewModel
import updated.mysterium.vpn.ui.top.up.play.billing.summary.PlayBillingDataSource
import updated.mysterium.vpn.ui.top.up.play.billing.summary.PlayBillingSummaryViewModel

object FlavorModules {

    val main = module {
        single {
            PlayBillingDataSource(androidApplication())
        }
        viewModel {
            PlayBillingAmountUsdViewModel(get())
        }
        viewModel {
            PlayBillingSummaryViewModel(get(), get())
        }
    }
}

