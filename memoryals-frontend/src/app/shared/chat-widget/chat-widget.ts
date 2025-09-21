import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/usuario/chat';
import { Auth as AuthService } from '../../core/services/usuario/auth';
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

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user?.id && this.isOpen) this.cargarHistorial();
      if (!user) this.resetChat();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.user?.id && this.user?.token) this.cargarHistorial();
  }

  cargarHistorial() {
    if (!this.user?.token) return;
    this.chatService.cargarChatHistory(this.user.id, this.user.token).subscribe({
      next: res => this.messages = res.history || [],
      error: err => console.error('❌ Error cargando historial:', err)
    });
  }

  sendMessage() {
    if (!this.user?.token || !this.newMessage.trim()) return;
    const message = this.newMessage.trim();
    this.messages.push({ role: 'user', content: message });
    this.newMessage = '';
    this.loading = true;

    this.chatService.sendMessage(this.user.id, message, this.user.token).subscribe({
      next: res => {
        this.loading = false;
        this.messages.push({ role: 'assistant', content: res.reply || '' });
      },
      error: err => {
        this.loading = false;
        this.messages.push({ role: 'assistant', content: '⚠️ Error procesando el mensaje' });
        console.error('❌ Error en sendMessage:', err);
      }
    });
  }

  borrarHistorial() {
    if (!this.user?.token) return;
    this.chatService.deleteChatHistory(this.user.id, this.user.token).subscribe({
      next: () => this.resetChat(),
      error: err => console.error('❌ Error borrando historial:', err)
    });
  }

  private resetChat() {
    this.messages = [];
    this.newMessage = '';
    this.isOpen = false;
  }
}
