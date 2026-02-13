'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

interface ParsedMenuItem {
  name: string;
  price: number;
  description: string;
  category: string;
}

export function PDFMenuUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const { toast, ToastContainer } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setParsedItems([]);
      setSelectedItems(new Set());
    } else {
      toast('Please select a PDF file', 'error');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast('Please select a file first', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('menu', file);

      const response = await fetch('http://localhost:4000/api/menu/upload-pdf', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setParsedItems(data.items);
      setSelectedItems(new Set(data.items.map((_: any, i: number) => i)));
      toast(`Found ${data.itemsFound} menu items!`, 'success');
    } catch (error) {
      console.error('Upload error:', error);
      toast('Failed to parse PDF. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const toggleAll = () => {
    if (selectedItems.size === parsedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(parsedItems.map((_, i) => i)));
    }
  };

  const handleImport = async () => {
    const itemsToImport = parsedItems.filter((_, i) => selectedItems.has(i));

    if (itemsToImport.length === 0) {
      toast('Please select at least one item to import', 'warning');
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch('http://localhost:4000/api/menu/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ items: itemsToImport }),
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const data = await response.json();
      toast(data.message, 'success');
      
      // Reset state
      setFile(null);
      setParsedItems([]);
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Import error:', error);
      toast('Failed to import menu items', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF Menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📄</div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="btn-secondary cursor-pointer inline-block"
              >
                Choose PDF File
              </label>
              {file && (
                <p className="mt-4 text-sm text-gray-400">
                  Selected: <span className="text-white">{file.name}</span>
                </p>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={!file}
              className="w-full"
            >
              Parse Menu
            </Button>

            <div className="text-sm text-gray-400">
              <p className="font-medium mb-2">Supported formats:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>PDF files with structured text (not scanned images)</li>
                <li>Menu format: Item Name ... Price</li>
                <li>Maximum file size: 10MB</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Parsed Items */}
        {parsedItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Parsed Menu Items</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedItems.size} of {parsedItems.length} items selected
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={toggleAll}>
                    {selectedItems.size === parsedItems.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleImport}
                    isLoading={isUploading}
                  >
                    Import Selected
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsedItems.map((item, index) => (
                  <div
                    key={index}
                    className={`card-hover p-4 cursor-pointer ${
                      selectedItems.has(index) ? 'border-green-500' : ''
                    }`}
                    onClick={() => toggleItem(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(index)}
                            onChange={() => toggleItem(index)}
                            className="w-5 h-5"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-400 mt-1">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="badge badge-default">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-500">
                          ₹{item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
