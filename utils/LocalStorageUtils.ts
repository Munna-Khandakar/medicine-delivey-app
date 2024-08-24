'use client';

import {CartItem} from '@/types/CartItem';

export class LocalStorageUtils {

    static isLocalStorageAvailable() {
        return typeof window !== 'undefined';
    }

    static setItem(key: string, value: any) {
        if (this.isLocalStorageAvailable()) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    static getItem(key: string) {
        if (this.isLocalStorageAvailable()) {
            return localStorage.getItem(key);
        }
        return null;
    }

    static removeItem(key: string) {
        if (this.isLocalStorageAvailable()) {
            localStorage.removeItem(key);
        }
    }

    static getCart() {
        if (this.isLocalStorageAvailable()) {
            return JSON.parse(this.getItem('cart') || '[]');
        }
        return [];
    }

    static addToCart(item: CartItem) {

        if (!this.isLocalStorageAvailable()) return;

        const cart = this.getCart();
        const index = cart.findIndex((cartItem: CartItem) => cartItem.id === item.id);
        if (index !== -1) {
            cart[index].quantity = item.quantity;
            this.setItem('cart', cart);
            return;
        } else {
            cart.push(item);
            this.setItem('cart', cart);
        }
    }

    static removeFromCart(id: string) {
        const cart = this.getCart();
        const index = cart.findIndex((cartItem: CartItem) => cartItem.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
            this.setItem('cart', cart);
        }
    }

    static setProfile(profile: any) {
        this.setItem('profile', profile);
    }
    static getProfile() {
        if (this.isLocalStorageAvailable()) {
            return JSON.parse(this.getItem('profile') || '{}');
        }
    }
}