package updated.mysterium.vpn.ui.terms

import androidx.lifecycle.ViewModel
import updated.mysterium.vpn.common.extensions.liveDataResult
import updated.mysterium.vpn.network.provider.usecase.UseCaseProvider

class TermsOfUseViewModel(useCaseProvider: UseCaseProvider) : ViewModel() {

    private val termsUseCase = useCaseProvider.terms()

    fun isTermsAccepted() = termsUseCase.isTermsAccepted()

    fun termsAccepted() {
        termsUseCase.userAcceptTerms()
    }

    fun getShortVersion() = liveDataResult {
        termsUseCase.getShortTerms()
    }

    fun getFullVersion() = liveDataResult {
        termsUseCase.getFullTerms()
    }
}
