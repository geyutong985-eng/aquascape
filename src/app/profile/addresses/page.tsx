"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash, MapPin } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseClient } from "@/lib/supabase/client";

interface Address {
  id: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", region: "", detail: "" });

  // 从 Supabase 加载地址
  useEffect(() => {
    const fetchAddresses = async () => {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      // 只获取当前用户有权限的数据（RLS自动过滤）
      const { data, error } = await supabase
        .from("addresses")
        .select("*");

      if (!error && data) {
        setAddresses(data);
      }
      setLoading(false);
    };

    fetchAddresses();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.region || !formData.detail) return;

    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return;

    if (editingId) {
      // 更新现有地址
      await supabase
        .from("addresses")
        .update({
          name: formData.name,
          phone: formData.phone,
          region: formData.region,
          detail: formData.detail,
        })
        .eq("id", editingId);

      setAddresses(addresses.map((a) =>
        a.id === editingId ? { ...a, ...formData } : a
      ));
    } else {
      // 新增地址
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: session.user.id,
          name: formData.name,
          phone: formData.phone,
          region: formData.region,
          detail: formData.detail,
          is_default: addresses.length === 0,
        })
        .select()
        .single();

      if (!error && data) {
        setAddresses([data, ...addresses]);
      }
    }

    setFormData({ name: "", phone: "", region: "", detail: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const supabase = createSupabaseClient();
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = async (id: string) => {
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return;

    // 先把所有地址设为非默认
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", session.user.id);

    // 把选中的设为默认
    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    setAddresses(addresses.map((a) => ({ ...a, is_default: a.id === id })));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-accent rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-medium text-foreground">收货地址</h1>
            <p className="text-sm text-muted-foreground">管理你的收货地址</p>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="w-4 h-4 mr-2" /> 新增
          </Button>
        )}
      </div>

      {/* Form */}
      {isEditing && (
        <div className="bg-card rounded-xl border p-4 mb-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">收货人</Label>
                <Input
                  id="name"
                  placeholder="姓名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  placeholder="手机号"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">省份城市</Label>
              <Input
                id="region"
                placeholder="例如：上海市浦东新区"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail">详细地址</Label>
              <Input
                id="detail"
                placeholder="街道、楼栋、门牌号等"
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>保存</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({ name: "", phone: "", region: "", detail: "" });
                }}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {addresses.length === 0 && !isEditing ? (
        <div className="text-left py-12 pl-14">
          <p className="text-muted-foreground">还没有收货地址</p>
          <Button variant="link" onClick={() => setIsEditing(true)} className="mt-2 pl-0">
            添加收货地址
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-card rounded-xl border p-4"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{address.name}</span>
                    <span className="text-sm text-muted-foreground">{address.phone}</span>
                    {address.is_default && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        默认
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {address.region} {address.detail}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(address.id);
                      setFormData({
                        name: address.name,
                        phone: address.phone,
                        region: address.region,
                        detail: address.detail,
                      });
                      setIsEditing(true);
                    }}
                    className="p-1.5 hover:bg-accent rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-1.5 hover:bg-accent rounded-md transition-colors text-muted-foreground"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {!address.is_default && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="text-sm text-muted-foreground hover:text-foreground mt-2 ml-8"
                >
                  设为默认
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}