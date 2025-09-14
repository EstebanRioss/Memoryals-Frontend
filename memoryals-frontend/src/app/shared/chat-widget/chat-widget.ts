import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat';
import { Auth as AuthService } from '../../core/services/auth';
import { Subscription } from 'rxjs';

interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
  styleUrls: ['./chat-widget.css']
})
export class ChatWidget implements OnInit, OnDestroy {
  isOpen = false;
  messages: ChatMessage[] = [];
  newMessage = '';
  loading = false;
  user: any = null;
  authSub?: Subscription;

  // 🔹 nuevo: indicador de historial
  hasHistory = false;
  historyMessage = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.user = user;

      if (user?.id && this.isOpen) {
        this.cargarHistorial();
      } else if (!user) {
        this.user = null;
        this.messages = [];
        this.isOpen = false;
        this.hasHistory = false;
        this.historyMessage = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.user?.id) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    if (!this.user?.id) return;

    console.log('🔄 Cargando historial de chat para usuario:', this.user.id);

    this.chatService.cargarChatHistory(this.user.id).subscribe({
      next: (res: any) => {
        this.messages = res.history || [];
        this.hasHistory = this.messages.length > 0;
        this.historyMessage = res.message || '';
      },
      error: (err) => {
        console.error('❌ Error cargando historial:', err);
        this.hasHistory = false;
        this.historyMessage = '⚠️ Error cargando historial';
      }
    });
  }

  sendMessage() {
    if (!this.user?.id) {
      this.messages.push({
        role: 'assistant',
        content: '⚠️ Necesitas estar logueado para usar el chat.'
      });
      return;
    }

    if (!this.newMessage.trim()) return;

    const message = this.newMessage.trim();
    this.messages.push({ role: 'user', content: message });
    this.newMessage = '';
    this.loading = true;

    this.chatService.sendMessage(this.user.id, message).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.messages.push({ role: 'assistant', content: res.reply });
        this.hasHistory = true; // en cuanto manda el primer mensaje ya tiene historial
      },
      error: (err) => {
        this.loading = false;
        this.messages.push({
          role: 'assistant',
          content: '⚠️ Lo sentimos, hubo un error al procesar tu mensaje.'
        });
        console.error('❌ Error en sendMessage:', err);
      }
    });
  }

  borrarHistorial() {
    if (!this.user?.id) return;

    this.chatService.deleteChatHistory(this.user.id).subscribe({
      next: () => {
        this.messages = [];
        this.hasHistory = false;
        this.historyMessage = '⚠️ No hay historial de chat para este usuario';
      },
      error: (err) => {
        console.error('❌ Error borrando historial:', err);
      }
    });
  }
}
