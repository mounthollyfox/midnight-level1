import { useState, useEffect } from 'react'
import { MessageSquare, Send, Trash2, Lock, Wallet, LogOut } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'
import { ContractService } from './contractService'
import './index.css'

interface Post {
  content: string
  owner: string
  sequence: number
  id: number
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [localSecretKey, setLocalSecretKey] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [contractService, setContractService] = useState<ContractService | null>(null)
  const [contractState, setContractState] = useState<any>(null)

  useEffect(() => {
    // Check if wallet is already connected on mount
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      // Check if Lace wallet is available
      if (window.cardano && window.cardano.lace) {
        const isEnabled = await window.cardano.lace.isEnabled()
        if (isEnabled) {
          const addresses = await window.cardano.lace.getUsedAddresses()
          if (addresses.length > 0) {
            setWalletAddress(addresses[0])
            setIsConnected(true)
          }
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true)
      if (!window.cardano || !window.cardano.lace) {
        alert('Lace wallet not found. Please install Lace wallet extension.')
        return
      }

      const addresses = await window.cardano.lace.enable()
      if (addresses.length > 0) {
        setWalletAddress(addresses[0])
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      setIsConnected(false)
      setWalletAddress('')
      // Note: Lace doesn't have a direct disconnect method, so we just clear the state
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  const handleDeploy = async () => {
    try {
      setIsLoading(true)
      // For now, use a simulated address - in production this would deploy to Preprod
      const simulatedAddress = '0x' + Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')
      setContractAddress(simulatedAddress)
      
      // Initialize contract service
      const service = new ContractService({
        contractAddress: simulatedAddress,
        network: 'preprod'
      })
      await service.initialize()
      setContractService(service)
      
      // Get initial contract state
      const state = await service.getContractState()
      setContractState(state)
      
      setPosts([])
    } catch (error) {
      console.error('Error deploying contract:', error)
      alert('Failed to deploy contract')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePost = async () => {
    if (!newMessage.trim()) {
      alert('Please enter a message')
      return
    }
    if (!localSecretKey) {
      alert('Please enter your local secret key')
      return
    }
    if (localSecretKey.length !== 64) {
      alert('Local secret key must be 64 hex characters')
      return
    }
    if (!contractService) {
      alert('Please deploy a contract first')
      return
    }

    try {
      setIsLoading(true)
      const txId = await contractService.postMessage(localSecretKey, newMessage)
      
      // Simulate posting with the circuit result
      const newPost: Post = {
        id: posts.length,
        content: newMessage,
        owner: localSecretKey.slice(0, 8) + '...' + localSecretKey.slice(-6),
        sequence: contractState?.sequence || 1,
      }
      setPosts([...posts, newPost])
      setNewMessage('')
      
      alert(`Message posted successfully! Transaction ID: ${txId}`)
    } catch (error) {
      console.error('Error posting message:', error)
      alert('Failed to post message')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTakeDown = async (postId: number) => {
    if (!localSecretKey) {
      alert('Please enter your local secret key')
      return
    }
    if (localSecretKey.length !== 64) {
      alert('Local secret key must be 64 hex characters')
      return
    }
    if (!contractService) {
      alert('Please deploy a contract first')
      return
    }

    const post = posts.find(p => p.id === postId)
    if (!post) return

    const ownerPrefix = localSecretKey.slice(0, 8) + '...' + localSecretKey.slice(-6)
    if (post.owner !== ownerPrefix) {
      alert('You can only take down your own posts')
      return
    }

    try {
      setIsLoading(true)
      const txId = await contractService.takeDownMessage(localSecretKey)
      
      setPosts(posts.filter(p => p.id !== postId))
      alert(`Message taken down successfully! Transaction ID: ${txId}`)
    } catch (error) {
      console.error('Error taking down message:', error)
      alert('Failed to take down message')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-blue-600" />
            BBoard
          </h1>
          <p className="text-gray-600">Multi-Post Decentralized Bulletin Board</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <Button
                    onClick={handleConnectWallet}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Lace Wallet'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Connected:</p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {walletAddress}
                    </p>
                    <Button
                      onClick={handleDisconnectWallet}
                      variant="outline"
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contract Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!contractAddress ? (
                  <Button onClick={handleDeploy} className="w-full" disabled={!isConnected}>
                    Deploy New Contract
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Contract Address:</p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {contractAddress}
                    </p>
                    <Button
                      onClick={handleDeploy}
                      variant="outline"
                      className="w-full"
                    >
                      Deploy New Contract
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Local Secret Key (64 hex chars):</label>
                  <Input
                    placeholder="Enter your 64-character hex secret key"
                    value={localSecretKey}
                    onChange={(e) => setLocalSecretKey(e.target.value)}
                    maxLength={64}
                  />
                  <p className="text-xs text-gray-500">
                    {localSecretKey.length}/64 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Post Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                />
                <Button 
                  onClick={handlePost} 
                  className="w-full"
                  disabled={!contractAddress}
                >
                  Post to Board
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Bulletin Board ({posts.length} posts)</CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No posts yet</p>
                    <p className="text-sm text-gray-400 mt-2">Be the first to post a message!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
 className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-mono text-gray-500">
                            Owner: {post.owner}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTakeDown(post.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Take down post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-900 text-base leading-relaxed">{post.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Post ID: {post.id} • Sequence: {post.sequence}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
