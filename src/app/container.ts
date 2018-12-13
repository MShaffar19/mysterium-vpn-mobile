/*
 * Copyright (C) 2018 The 'mysteriumnetwork/mysterium-vpn-mobile' Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import TequilapiClientFactory from 'mysterium-tequilapi'
import { Platform } from 'react-native'
import { IBugReporter } from '../bug-reporter/bug-reporter'
import BugReporterConsole from '../bug-reporter/bug-reporter-console'
import BugReporterFabric from '../bug-reporter/bug-reporter-fabric'
import IFeedbackReporter from '../bug-reporter/feedback-reporter'
import FeedbackReporterConsole from '../bug-reporter/feedback-reporter-console'
import FeedbackReporterFabric from '../bug-reporter/feedback-reporter-fabric'
import { CONFIG } from '../config'
import { FavoritesStorage } from '../libraries/favorites-storage'
import TequilApiDriver from '../libraries/tequil-api/tequil-api-driver'
import TequilApiState from '../libraries/tequil-api/tequil-api-state'
import IConnectionAdapter from './adapters/connection-adapter'
import ProposalsAdapter from './adapters/proposals-adapter'
import TequilapiConnectionAdapter from './adapters/tequilapi-connection-adapter'
import AppLoader from './app-loader'
import Connection from './domain/connection'
import MessageDisplayDelegate from './messages/message-display-delegate'
import Favorites from './proposals/favorites'
import ProposalList from './proposals/proposal-list'
import ConnectionStore from './stores/connection-store'
import ProposalsStore from './stores/proposals-store'
import ScreenStore from './stores/screen-store'
import VpnAppState from './vpn-app-state'

class Container {
  public readonly api = new TequilapiClientFactory(CONFIG.TEQUILAPI_ADDRESS, CONFIG.TEQUILAPI_TIMEOUT).build()
  public readonly tequilApiState = new TequilApiState()
  public readonly vpnAppState = new VpnAppState()
  public readonly messageDisplayDelegate = new MessageDisplayDelegate()
  public readonly favoritesStore = new FavoritesStorage()

  // adapters
  public readonly connectionAdapter: IConnectionAdapter = new TequilapiConnectionAdapter(this.api)
  public readonly proposalsAdapter = new ProposalsAdapter(this.api)

  // domain
  public readonly connection = new Connection(this.connectionAdapter, this.tequilApiState)

  // stores
  public readonly connectionStore = new ConnectionStore(this.connection)
  public readonly proposalsStore = new ProposalsStore(this.proposalsAdapter)
  public readonly screenStore = new ScreenStore()
  public readonly tequilAPIDriver =
    new TequilApiDriver(this.api, this.tequilApiState, this.connection, this.messageDisplayDelegate)

  public readonly proposalList = new ProposalList(this.proposalsStore, this.favoritesStore)
  public readonly favorites = new Favorites(this.favoritesStore)
  public readonly appLoader = new AppLoader(this.tequilAPIDriver, this.connection, this.proposalsStore)
  public readonly bugReporter = this.buildBugReporter()
  public readonly feedbackReporter = this.buildFeedbackReporter()

  private buildBugReporter (): IBugReporter {
    return this.useFabric ? new BugReporterFabric() : new BugReporterConsole()
  }

  private buildFeedbackReporter (): IFeedbackReporter {
    return this.useFabric ? new FeedbackReporterFabric() : new FeedbackReporterConsole()
  }

  private get useFabric (): boolean {
    return !__DEV__ && Platform.OS === 'android'
  }
}

export default Container
