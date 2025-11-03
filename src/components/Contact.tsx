import { Phone, Instagram, MessageCircle, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Entre em Contato</h1>
        <p className="text-zinc-400 text-center mb-12">
          Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href="https://wa.me/5519992483502"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg p-8 flex flex-col items-center text-center transition-all transform hover:scale-105 shadow-lg"
          >
            <MessageCircle size={48} className="text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">WhatsApp</h2>
            <p className="text-green-100 mb-4">
              Fale conosco diretamente pelo WhatsApp
            </p>
            <span className="text-white font-semibold">+55 19 99248-3502</span>
          </a>

          <a
            href="https://www.instagram.com/viniciuss.lucas"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg p-8 flex flex-col items-center text-center transition-all transform hover:scale-105 shadow-lg"
          >
            <Instagram size={48} className="text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Instagram</h2>
            <p className="text-pink-100 mb-4">
              Siga-nos no Instagram para novidades
            </p>
            <span className="text-white font-semibold">@viniciuss.lucas</span>
          </a>
        </div>

        <div className="bg-zinc-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Informações de Contato
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-zinc-300">
              <Phone className="text-amber-400" size={24} />
              <div>
                <p className="font-semibold text-white">Telefone / WhatsApp</p>
                <p>+55 19 99248-3502</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-zinc-300">
              <Instagram className="text-amber-400" size={24} />
              <div>
                <p className="font-semibold text-white">Instagram</p>
                <p>@viniciuss.lucas</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-zinc-300">
              <Mail className="text-amber-400" size={24} />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p>contato@vlstoreimport.com</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-700">
            <h3 className="text-lg font-semibold text-white mb-4">Horário de Atendimento</h3>
            <div className="text-zinc-300 space-y-2">
              <p>Segunda a Sexta: 9h às 18h</p>
              <p>Sábado: 9h às 13h</p>
              <p>Domingo: Fechado</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Dúvidas sobre nossos produtos?
          </h3>
          <p className="text-amber-50 mb-4">
            Nossa equipe está pronta para ajudar você a escolher o perfume perfeito!
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://wa.me/5519992483502"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-amber-600 px-6 py-2 rounded-lg font-semibold hover:bg-zinc-100 transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
