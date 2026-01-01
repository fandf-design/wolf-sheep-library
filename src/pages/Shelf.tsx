import { useState } from "react";
import { Link } from "react-router-dom";
import { Share2, Pencil, X, Plus, Trash2 } from "lucide-react";
import { ShelfTabs, IssueCardCompact, ShareWishlistModal } from "@/components/shelf";
import { AlertMeModal } from "@/components/issue";
import { useWishlist } from "@/hooks/use-wishlist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IssueStatus } from "@/types/issue-status";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  postal: string;
  country: string;
}

// Sample issues database (would come from API/CMS in production)
const issuesDatabase: Record<string, {
  id: string;
  title: string;
  status: IssueStatus;
  material: string;
  volumeTitle: string;
  chapterTitle: string;
}> = {
  "alpha-coat-001": {
    id: "alpha-coat-001",
    title: "Alpha's Burden Overcoat",
    status: "limited",
    material: "Wool-Cashmere",
    volumeTitle: "Dominion",
    chapterTitle: "The Alpha Principle"
  },
  "omega-shroud-001": {
    id: "omega-shroud-001",
    title: "The Yielding Knit",
    status: "acquire",
    material: "Merino Wool",
    volumeTitle: "Dominion",
    chapterTitle: "The Omega's Rest"
  },
  "hunt-silk-001": {
    id: "hunt-silk-001",
    title: "Predator's Silk Shirt",
    status: "vaulted",
    material: "Mulberry Silk",
    volumeTitle: "Dominion",
    chapterTitle: "The Hunt"
  },
  "shearing-wrap-001": {
    id: "shearing-wrap-001",
    title: "The Aftermath Wrap",
    status: "reserve",
    material: "Cashmere Blend",
    volumeTitle: "Dominion",
    chapterTitle: "After the Shearing"
  },
  "nocturne-cloak-001": {
    id: "nocturne-cloak-001",
    title: "Midnight Wanderer Cloak",
    status: "alert",
    material: "Wool-Silk",
    volumeTitle: "Dominion",
    chapterTitle: "Solitary Passage"
  }
};

// Mock acquired issues (would come from order history)
// Mock acquired issues (would come from order history)
const acquiredIssues = [{
  id: "alpha-coat-001",
  acquisitionDate: "March 2024",
  edition: "037/100"
}, {
  id: "omega-shroud-001",
  acquisitionDate: "April 2024",
  edition: "089/100"
}];

// Address Form Component
const AddressForm = ({ 
  address, 
  onSave, 
  onCancel, 
  onChange,
  isNew = false 
}: { 
  address: Omit<Address, "id"> | Address;
  onSave: (address: Omit<Address, "id">) => void;
  onCancel: () => void;
  onChange?: (address: Omit<Address, "id">) => void;
  isNew?: boolean;
}) => {
  const [form, setForm] = useState<Omit<Address, "id">>({
    label: address.label,
    street: address.street,
    city: address.city,
    postal: address.postal,
    country: address.country
  });

  const handleChange = (field: keyof Omit<Address, "id">, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-body-sm text-muted-foreground block mb-1">Label</label>
        <Input 
          value={isNew ? address.label : form.label}
          onChange={(e) => handleChange("label", e.target.value)}
          placeholder="Home, Work, etc."
          className="bg-background/50"
        />
      </div>
      <div>
        <label className="text-body-sm text-muted-foreground block mb-1">Street</label>
        <Input 
          value={isNew ? address.street : form.street}
          onChange={(e) => handleChange("street", e.target.value)}
          placeholder="123 Main St"
          className="bg-background/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-body-sm text-muted-foreground block mb-1">City</label>
          <Input 
            value={isNew ? address.city : form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="City"
            className="bg-background/50"
          />
        </div>
        <div>
          <label className="text-body-sm text-muted-foreground block mb-1">Postal</label>
          <Input 
            value={isNew ? address.postal : form.postal}
            onChange={(e) => handleChange("postal", e.target.value)}
            placeholder="12345"
            className="bg-background/50"
          />
        </div>
      </div>
      <div>
        <label className="text-body-sm text-muted-foreground block mb-1">Country</label>
        <Input 
          value={isNew ? address.country : form.country}
          onChange={(e) => handleChange("country", e.target.value)}
          placeholder="Country"
          className="bg-background/50"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button 
          onClick={() => onSave(isNew ? address as Omit<Address, "id"> : form)}
          variant="secondary"
          size="sm"
        >
          {isNew ? "Add" : "Save"}
        </Button>
        <Button 
          onClick={onCancel}
          variant="ghost"
          size="sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
const Shelf = () => {
  const [activeTab, setActiveTab] = useState<"acquired" | "wishlist">("acquired");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const {
    items: wishlistItems,
    removeFromWishlist
  } = useWishlist();

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "collector@archive.myth",
    phone: "",
    memberSince: 2024
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    label: "",
    street: "",
    city: "",
    postal: "",
    country: ""
  });

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleCancelProfileEdit = () => {
    setEditedProfile(profile);
    setIsEditingProfile(false);
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city) return;
    const address: Address = {
      ...newAddress,
      id: crypto.randomUUID()
    };
    setAddresses([...addresses, address]);
    setNewAddress({ label: "", street: "", city: "", postal: "", country: "" });
    setIsAddingAddress(false);
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleUpdateAddress = (id: string, updated: Omit<Address, "id">) => {
    setAddresses(addresses.map(a => a.id === id ? { ...updated, id } : a));
    setEditingAddressId(null);
  };

  // Get full issue data for acquired items
  const acquiredData = acquiredIssues.map(acquired => {
    const issue = issuesDatabase[acquired.id];
    if (!issue) return null;
    return {
      ...issue,
      acquisitionDate: acquired.acquisitionDate
    };
  }).filter(Boolean) as Array<typeof issuesDatabase[string] & {
    acquisitionDate: string;
  }>;

  // Get full issue data for wishlist items
  const wishlistData = wishlistItems.map(item => issuesDatabase[item.issueId]).filter(Boolean);

  const handleAlertMe = (issue: {
    id: string;
    title: string;
  }) => {
    setSelectedIssue(issue);
    setAlertModalOpen(true);
  };
  return <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-4xl mx-auto page-enter">
          <span className="text-meta block mb-6">Your Archive</span>
          <h1 className="text-display-xl mb-6">The Shelf</h1>
          <p className="text-body text-lg text-muted-foreground max-w-2xl">
            Every Issue you've acquired becomes part of your personal mythology.
            Your collection tells a story about the tensions you embody.
          </p>
        </div>
      </section>

      {/* Tabs & Content */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <ShelfTabs activeTab={activeTab} onTabChange={setActiveTab} acquiredCount={acquiredData.length} wishlistCount={wishlistData.length} />
            
            {activeTab === "wishlist" && wishlistData.length > 0 && <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-2 text-meta text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Share Wishlist
              </button>}
          </div>

          {/* Acquired Tab */}
          {activeTab === "acquired" && <>
              {acquiredData.length > 0 ? <div className="space-y-4">
                  {acquiredData.map(issue => <IssueCardCompact key={issue.id} issue={issue} />)}
                </div> : <div className="text-center py-24 border border-border">
                  <p className="text-body text-muted-foreground mb-6">
                    Your shelf awaits its first artifact.
                  </p>
                  <Link to="/" className="link-archival">
                    Enter the Library
                  </Link>
                </div>}
            </>}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && <>
              {wishlistData.length > 0 ? <div className="space-y-4">
                  {wishlistData.map(issue => <IssueCardCompact key={issue.id} issue={issue} showRemoveButton showCTA onRemove={() => removeFromWishlist(issue.id)} onAcquire={() => console.log("Acquire:", issue.title)} onReserve={() => console.log("Reserve:", issue.title)} onAlertMe={() => handleAlertMe(issue)} />)}
                </div> : <div className="text-center py-24 border border-border">
                  <p className="text-body text-muted-foreground mb-6">
                    No Issues saved yet.
                  </p>
                  <Link to="/" className="link-archival">
                    Explore the Library
                  </Link>
                </div>}
            </>}
        </div>
      </section>

      {/* Account Section */}
      <section className="py-20 px-6 md:px-12 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-meta block mb-2">Account Settings</span>
            <h3 className="text-display-sm">Account</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="bg-muted/30 border border-border/50 p-6 rounded-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-ui text-muted-foreground">Profile</span>
                {!isEditingProfile ? (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handleCancelProfileEdit}
                    className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {!isEditingProfile ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-body-sm text-muted-foreground block">Name</span>
                    <p className="text-body text-foreground">{profile.name || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-body-sm text-muted-foreground block">Email</span>
                    <p className="text-body text-foreground">{profile.email}</p>
                  </div>
                  <div>
                    <span className="text-body-sm text-muted-foreground block">Phone</span>
                    <p className="text-body text-foreground">{profile.phone || "Not set"}</p>
                  </div>
                  <div className="pt-3 border-t border-border/30">
                    <span className="text-body-sm text-muted-foreground">Member since {profile.memberSince}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-body-sm text-muted-foreground block mb-1">Name</label>
                    <Input 
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      placeholder="Your name"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <label className="text-body-sm text-muted-foreground block mb-1">Email</label>
                    <Input 
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <label className="text-body-sm text-muted-foreground block mb-1">Phone</label>
                    <Input 
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={handleSaveProfile}
                      variant="secondary"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={handleCancelProfileEdit}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Addresses Card */}
            <div className="bg-muted/30 border border-border/50 p-6 rounded-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-ui text-muted-foreground">Addresses</span>
                {!isAddingAddress && (
                  <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {addresses.length === 0 && !isAddingAddress ? (
                <div>
                  <p className="text-body-sm text-muted-foreground mb-4">No addresses on file</p>
                  <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="text-ui text-accent/80 hover:text-accent transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border-b border-border/30 pb-4 last:border-0 last:pb-0">
                      {editingAddressId === address.id ? (
                        <AddressForm 
                          address={address}
                          onSave={(updated) => handleUpdateAddress(address.id, updated)}
                          onCancel={() => setEditingAddressId(null)}
                        />
                      ) : (
                        <div className="flex justify-between">
                          <div>
                            {address.label && (
                              <span className="text-body-sm text-muted-foreground block">{address.label}</span>
                            )}
                            <p className="text-body text-foreground">{address.street}</p>
                            <p className="text-body-sm text-muted-foreground">
                              {address.city}{address.postal && `, ${address.postal}`}
                              {address.country && ` · ${address.country}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingAddressId(address.id)}
                              className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleRemoveAddress(address.id)}
                              className="text-muted-foreground/60 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {isAddingAddress && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <AddressForm 
                    address={newAddress}
                    onSave={(address) => {
                      handleAddAddress();
                    }}
                    onCancel={() => {
                      setNewAddress({ label: "", street: "", city: "", postal: "", country: "" });
                      setIsAddingAddress(false);
                    }}
                    onChange={setNewAddress}
                    isNew
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Share Wishlist Modal */}
      <ShareWishlistModal open={shareModalOpen} onOpenChange={setShareModalOpen} />

      {/* Alert Me Modal */}
      {selectedIssue && <AlertMeModal open={alertModalOpen} onOpenChange={setAlertModalOpen} productId={selectedIssue.id} productTitle={selectedIssue.title} />}
    </main>;
};
export default Shelf;