import { useEffect, useState } from 'react';
import { Gift, Eye } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
// Firebase Imports
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

// Interface define kar rahe hain
interface CustomGiftBox {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  box_theme: string;
  budget_range: string;
  selected_items?: string[];
  custom_message?: string;
  status: string;
  updated_at?: string;
}

export function AdminCustomBoxes() {
  const [customBoxes, setCustomBoxes] = useState<CustomGiftBox[]>([]);
  const [selectedBox, setSelectedBox] = useState<CustomGiftBox | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCustomBoxes();
  }, []);

  const loadCustomBoxes = async () => {
    try {
      // Firebase se data lana (Newest first)
      const boxesRef = collection(db, 'custom_gift_boxes');
      const q = query(boxesRef, orderBy('created_at', 'desc'));
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CustomGiftBox[];
      
      setCustomBoxes(data);
    } catch (error) {
      console.error("Error loading boxes, trying fallback:", error);
      // Fallback: Agar index error aaye to bina sort ke load karo
      try {
        const snapshot = await getDocs(collection(db, 'custom_gift_boxes'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CustomGiftBox[];
        setCustomBoxes(data);
      } catch (e) {
        console.error("Failed to load custom boxes");
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      // Firebase update
      const boxRef = doc(db, 'custom_gift_boxes', id);
      await updateDoc(boxRef, { 
        status, 
        updated_at: new Date().toISOString() 
      });

      loadCustomBoxes(); // List refresh
      if (selectedBox?.id === id) {
        setSelectedBox({ ...selectedBox, status } as CustomGiftBox);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewBox = (box: CustomGiftBox) => {
    setSelectedBox(box);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Custom Gift Box Requests</h1>
        <p className="text-gray-600">Manage personalized gift box requests</p>
      </div>

      {customBoxes.length === 0 ? (
        <Card className="p-12 text-center">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No custom box requests yet</h3>
          <p className="text-gray-500">Requests will appear here when customers submit them</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {customBoxes.map(box => (
            <Card key={box.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{box.customer_name}</h3>
                      <p className="text-sm text-gray-600">{box.customer_email}</p>
                      <p className="text-sm text-gray-600">{box.customer_phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(box.status)}`}>
                      {box.status.replace('_', ' ').charAt(0).toUpperCase() + box.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span>Theme: {box.box_theme}</span>
                    <span>Budget: {box.budget_range}</span>
                    <span>{new Date(box.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => viewBox(box)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {box.status === 'pending' && (
                      <Button size="sm" onClick={() => updateStatus(box.id, 'in_progress')}>
                        Start Working
                      </Button>
                    )}
                    {box.status === 'in_progress' && (
                      <Button size="sm" onClick={() => updateStatus(box.id, 'completed')}>
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Custom Gift Box Details"
        size="lg"
      >
        {selectedBox && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Name:</strong> {selectedBox.customer_name}</p>
                <p><strong>Email:</strong> {selectedBox.customer_email}</p>
                <p><strong>Phone:</strong> {selectedBox.customer_phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Box Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Theme/Occasion:</strong> {selectedBox.box_theme}</p>
                <p><strong>Budget Range:</strong> {selectedBox.budget_range}</p>
                <p><strong>Items Selected:</strong> {selectedBox.selected_items?.length || 0} items</p>
              </div>
            </div>

            {selectedBox.custom_message && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Custom Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 italic">"{selectedBox.custom_message}"</p>
                </div>
              </div>
            )}

            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Request Date: {new Date(selectedBox.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {['pending', 'in_progress', 'completed', 'cancelled'].map(status => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedBox.status === status ? 'primary' : 'outline'}
                    onClick={() => updateStatus(selectedBox.id, status)}
                  >
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
