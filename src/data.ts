import { ProductPrereq, PromoCoupon } from './types';

export const PRODUCTS: ProductPrereq[] = [
  {
    id: 'drone-quantum-pro',
    name: 'Drone Fotográfico Quantum Pro V2',
    description: 'Captura de vídeo em 8K, sensores de desvio de obstáculos omnidirecionais e autonomia de 45 minutos. O auge da precisão aérea para criadores exigentes.',
    price: 14500,
    originalPrice: 16000,
    rating: 4.9,
    reviewsCount: 128,
    category: 'Hardware',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKEze3jGPe5h2VSi-vSWIvfCK9P0iB2Hx18IRJrg6Rs2kl2PHX62tYfMuR1ErEfUf9JvG2P7E8gFwm1_GbtO_fDhfKp43ogtbwyrglBuAn60jqUDFlVJy3Ruchq3pvpW4FCBRv9n-RaW9spmyDTPOEXHLqC9wNmRfcBjlRuoYn5jHW0zpSvW2b6fAjPsbtzvVj6QK8KKKaLSvCYWYYnWnLt3TE7MY2JURonvMOAHk4rYM9E7QLDwrsmj3lIrnCKwah2LuDL-eVKKEX',
    bannerText: 'Premium',
    galleryUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKEze3jGPe5h2VSi-vSWIvfCK9P0iB2Hx18IRJrg6Rs2kl2PHX62tYfMuR1ErEfUf9JvG2P7E8gFwm1_GbtO_fDhfKp43ogtbwyrglBuAn60jqUDFlVJy3Ruchq3pvpW4FCBRv9n-RaW9spmyDTPOEXHLqC9wNmRfcBjlRuoYn5jHW0zpSvW2b6fAjPsbtzvVj6QK8KKKaLSvCYWYYnWnLt3TE7MY2JURonvMOAHk4rYM9E7QLDwrsmj3lIrnCKwah2LuDL-eVKKEX',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCI4v6ABHHoH7Q9uuuEbVEBgbjO_7mGussHQe1m5dTIQ4ayUuzFIqn4fHnhNoOBv_pIFVcWHLc6-EhFFGwdmUgvjdPPIhV4cNpRZXIez6so2RGOc1ouFQtgtTP-MbPSg8gstvKN3tSftMZbdSiR7lkhd3WDNhs69TsRftuqvL18mdOcRXVrGyM8YyhVKPihauQy2rJboX-HEj7QYE6IHh5MUV4sKa6JQ7A32Tt763RuDEzlU8Y-928JAFxRI0LZOQL-7aZDLz_lVou3',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDpnfMa3vcKGJRKDc6s7hpTO3DppTW-idpl2dUU0q6NtIQ_uQFccad_vhR4xezarAX-wNNX4dE0NWNsYYRYmN2hwppt5Y6sXiih0jz7EJZ8dZB_h_aWT22mslJ6gd5aPaH2QLgGqeabaDUmlVcRg3dqk3kvxDPXH0UEfHAMf1crmmSK7GfAsCw7Gly5Fs6xAJXY1LbuScpBMd8g24oOTleKUcRPTeB6-IALzYuJR40VhxfWhXiTrlBi1G6NLF7PRYAogB5hdMtdCwRV',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJmXBuq9QGdo03nOp-lkAeSnUmhmeEvLkD1PnioVI3OobY_mKEYqgZxnnnpMY2Mi40LXcCOcoWBuSIE6K3BE7GzZL-9rLInDPjtZ4ui2MjuDelVMdtSFZh1uruIBt_6m06MUZR7EJqCXG-dJ-8y6290UZKDZVYIMxITiD5I6-74pBLl9lbXtLnxl8tMbUb2q4BtKuSWFP4NbofH9pP7Aox6fbh5Q4zs9-i-4IGkvPR4pE4tsVtux7Kzc09PT8zklGLNgbmOy-U2Vfi'
    ],
    specs: {
      'Resolução': '8K HDR a 60fps',
      'Autonomia': '45 Minutos',
      'Velocidade Máx.': '82 km/h',
      'Sensores': 'Omnidirecional'
    },
    features: [
      'Gimbal motorizado com estabilização ativa em 3 eixos',
      'Sensores ópticos e infravermelhos em todas as direções',
      'Modo de rastreamento inteligente com IA proprietária',
      'Transmissão de vídeo de baixa latência em até 15km'
    ]
  },
  {
    id: 'nvidia-quantum-gpu',
    name: 'NVIDIA Quantum Core X-9000 GPU',
    description: 'A arquitetura definitiva para renderização em tempo real e workflows intensos de IA.',
    price: 12899,
    originalPrice: 14500,
    rating: 4.9,
    reviewsCount: 247,
    category: 'Hardware',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATzoxE6V2fnNIJOZwevest7zEX_53DE6NfoiDPltxaACNDZ2s6qwRiR89vsROlxMm1CJbeb0X6Vct16JzfLUTFlJOi87RgSSzfArbyQlgHEmFVjj2fXyePjOu1tvRymTJTqU6O55OuVOCkxSNz6jw8erNQsbJcUesaVLkG1FGgT6MgDhL6M_cyvB7pIuzbiH93eUXd5X9rcgdTG8GQIlfVs6x8X6qrbP57ErXDmR744Ujn4Hvdc1lON-P5ywBipmpStNOQl2p-ieSW',
    bannerText: 'Novo',
    specs: {
      'Memória': '24GB GDDR6X',
      'Resfriamento': 'Vapor Chamber Ativo',
      'Overclock': 'Sim, pré-configurado',
      'Interface': 'PCIe 5.0 x16'
    }
  },
  {
    id: 'visor-optico-pro',
    name: 'Visor Óptico Pro',
    description: 'Realidade aumentada com precisão cirúrgica para profissionais criativos e engenharia espacial.',
    price: 4299,
    rating: 4.8,
    reviewsCount: 31,
    category: 'Hardware',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWuQ8oA0GtUkL7MG2XoeKKCX1FAdxUjoa8X4mrL9JEaNTgjahuL_hk_XaJt38ucuJo8oTPld-Cr6eyIuuHV_e9rbm5K-RZ8mzNy3xA-hClgVjnCuiqe1aTwcI4ueAObwe4KOrPjkLf2iVO-uZEk3rDjIHd5TDJe4wMXQZSvdInnd_nl9_VjK77TLsOQ06rhyKEZeluMlQzXe0jbvSzVMW7ygXbI2S90L1iEQMpJjkTkMpudNAVxPJ3hYKB43maEo4E_ZQCriDLmYT5',
    bannerText: 'Novo',
    specs: {
      'Tela': 'Dual Micro-OLED 4K',
      'Refresh Rate': '120Hz',
      'FOV': '110 graus',
      'Latência': '< 10ms'
    }
  },
  {
    id: 'keyboard-tatar-x1',
    name: 'Teclado Tátil X1',
    description: 'Switches magnéticos ajustáveis em um chassi unibody de alumínio aeronáutico anodizado.',
    price: 1850,
    rating: 4.6,
    reviewsCount: 112,
    category: 'Periféricos',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYFEnsj_RJG-pVKDaJyPSVaQlBHzpwMu7axPMB_gguTrywP55EbrUNhaa_DldRf8A-KhKTA1rj95vvwpoMBpk1U4QPce-P2M4iCW3mTXdg2mLB8Gt25nS4tIBKoLWXtnbltlk1zzMPIn-m7o--5x7sOkQw5D0Rtz4nSIOVVDRU0y0eSb4TYFYuwG0U600c9e-Pvzy_pRFD92Ng8gKKmgDII8kkXjpjA7SQ9ZLyZ0bvQ--5tM6zljaR7AxjW7Dj0nHuqPjnCysnLGlZ',
    specs: {
      'Conexão': 'Ultra Link Dual-Band',
      'Switches': 'Efeito Hall Magnético',
      'Bateria': 'Até 120 horas'
    }
  },
  {
    id: 'audio-espacial-v2',
    name: 'Áudio Espacial V2',
    description: 'Cancelamento de ruído quântico com drivers avançados de grafeno para fidelidade cirúrgica.',
    price: 2400,
    rating: 4.9,
    reviewsCount: 89,
    category: 'Áudio High-End',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjpEQ2vR4nBaN3cc0ILbb5FAONktjavlPpfOKoPzCL-DCkpW17FY4pc6JUZZaxLRHL6SxURrQ0mIxXNCEDBxkwr7UuZf3aR7xfqrNbO6eUQd-69dIFG7gT5Eh2Sn_CmwkLLlrSD92VSYBjAy4vXB1qbmZa2_zzn0N2rQYjHXJ4OYCoZTq_uWOpkwzU-w-tAbe_cnWIIbKcGUXTNZcUoeWp-aSHozJ2vyoIGjz8Yjm7iFnwVZKnX9D1s7cI89kzn2-YYWfnyA7aIsX6',
    bannerText: 'Esgotando',
    specs: {
      'Drivers': '40mm Grafeno Coated',
      'Cancelamento': 'Adaptativo Ativo Pro',
      'Codec': 'Hi-Res Audio LDAC'
    }
  },
  {
    id: 'pad-analitico-core',
    name: 'Pad Analítico Core',
    description: 'Processamento de dados em tempo real com tela retina ultra fina de alta fidelidade cromática.',
    price: 6100,
    rating: 4.7,
    reviewsCount: 45,
    category: 'Hardware',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADpaBbSxLoBJcFgJjW9ks_OPl4JnuOglcbLePV9ZAqRNsLyZUvLxHUblti8QtT2veePJpNpDxtQvBxCsfc16T9BPwTl-i4DcBaqNI35k9IuBYEPJzH8Sincp2TV2PT0bPPHIwf9RoJbHHiMxMYY1zoTlo-eKmjg_yUY_ro__BrsGYjHz8xLh8N8qvF2DUNbCHjJWB-IZ3OsfVXpUY4-y2BGBT_4QIiC7fp_WfgJtZ4yXo_sMr8Vgj31EJovADtir8tjOpfPWX4tUxf',
    specs: {
      'Tela': '12.9" Retina AMOLED',
      'Chipset': 'Quantum Hexa 4nm',
      'Processamento': 'Realtime Tensor'
    }
  },
  {
    id: 'teclado-obsidian-pro',
    name: 'Teclado Mecânico Obsidian Pro TKL',
    description: 'Switches lineares de precisão extrema com chassi em alumínio aeroespacial e iluminação programável.',
    price: 1250,
    rating: 4.7,
    reviewsCount: 178,
    category: 'Periféricos',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsYjGxEPwBjYO9H9ckibChhIPcjTaR7c-LJKNoFA4bCK6uCAq4gCawhsjEYYFmwGsftvT8rI4OLQ8eD70efQFWS2AK4SQyY_r6t6WL_DHNvmx2a943dkG4P4HVnMvYCRrAsNHLuGQNMZm7AT_s_BLosx18NbwcRPh1AGv3D0dsxiov7i9luzbk9whr3G52VMyA0OlI_JiE8ygZJoL3FT4-cOManmqtb66cNSPDbtNTQEmI2Py_rFS2qaJYvycp_hExJ0-PBBrTtr9K',
    specs: {
      'Formato': 'TKL Compacto (80%)',
      'Switches': 'Gateron Optical Linear',
      'Keycaps': 'Double-Shot PBT'
    }
  },
  {
    id: 'headset-neural-link',
    name: 'Headset Neural Link V2',
    description: 'Áudio espacial de ultra-baixa latência com cancelamento de ruído adaptativo controlado por redes neurais.',
    price: 3100,
    rating: 5.0,
    reviewsCount: 96,
    category: 'Áudio High-End',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeZKyagyf4h0bwItsvhDYK6TTAp28bwEy3VTu_8xU71UrRAAEK0Tl_GbMtMvtpRGbaaGfFPQJao9XqBcFO4AlJ2p5_udYlwzO5iXKh4RGPOb6KzUoMO3OSxvTz8x-LGz_itADTFpxlrxZKWsyjTlT4cjQ4SNYXOJ4Mi_eyuUcTYhUf2gFK_yZbwklx2k-8BrMVt7lxwfzwlXSLwHP2bIziCkKV3tOrHBpZq6ZDbcRK3V7KGy7qoUCEyXplBklRNq89lYeekocfp4Ls',
    bannerText: 'Restam 2',
    specs: {
      'Latência': '2.4ms Quantum Link',
      'Drivers': '50mm Carbono Ativo',
      'Autonomia': '72 Horas'
    }
  },
  /* Cart specific products */
  {
    id: 'quantum-velocity-shoes',
    name: 'Quantum Velocity Pro',
    description: 'Calçado Esportivo - Edição Limitada. Desenvolvido com tecidos inteligentes e placa de fibra de carbono responsiva.',
    price: 1299,
    rating: 4.8,
    reviewsCount: 64,
    category: 'Wearables',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMrvNnZ2aTihh3iX1_v1R6yr5gat-afEyIkkpkXHeb_xChzaq8ACB4Y2RVRhFP_yEQbc4E7NKh0J3HYF9bzqpSP827rkH9JSuJ_HMMjKV6LxOdb8azcrxKXRne4abdDPamvYi7Pg_z7Hw47l74k-6JWIKPzcmNKAhyWrXAWz9k-t7eQDl5Coaeh9x4kwe13xGM--pl6RjpGq6kOJ1Mu6l6vLizYYDmYFWw2EaXhaqA6ozd3nSL_qEQGa2lPZr40GWBvLNZaRQqja_Z',
    specs: {
      'Solado': 'Fibra Carbono Integrada',
      'Peso': '180g p/ pé',
      'Tecido': 'Smart Knit Respirável'
    }
  },
  {
    id: 'aura-noise-headset',
    name: 'Aura Noise Cancelling',
    description: 'Fones de Ouvido Sem Fio de altíssima fidelidade acústica, ideais para isolamento absoluto em viagem ou estúdio.',
    price: 949, // Note 2 x 949 = 1898 from cart screen
    rating: 4.7,
    reviewsCount: 52,
    category: 'Áudio High-End',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuG-E2_bagVu-34xORuNeJWMn5_iHZrhXZOLXoivh3eKUdXO22LbKGBRPkCJMS0zkyvkDjpAOrpLwI7jYJJF-LHTmjPcEwUDNkVg6HwcS--42BQP6JUXr9VLfuTjq5JGTMZ9O8rHo4TnUVhEdU2g8872oSfMcydzmysLVCKZM-o-p48Ezg6sg1UAssX3sM8OcGJUW1eBvYO8wU541WEpRJvIGotWLn1ChIryWxDLVCVT0i1ZVtprr8wHhv0wYEpVn8SPcufNI2gcG6',
    specs: {
      'Duração': '40 Horas com ANC',
      'Carregamento': 'USB-C Ultra Fast',
      'Bolsa': 'Incluída em Couro Vegano'
    }
  },
  /* Related Products to the Drone */
  {
    id: 'case-quantum',
    name: 'Case de Transporte Quantum',
    description: 'Estojo robusto de alta durabilidade e isolamento interno moldado sob medida para o Drone Quantum Pro.',
    price: 850,
    rating: 4.8,
    reviewsCount: 14,
    category: 'Acessórios',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqvRYT3S4bn6agTF9ThI1-Sme-ohPq2DuMe052JXzlby0up8_nvfCg1KKxp31Lm2S06wtJTHSGiT3Qh41bIZpxcPcUDeLfdVOc17e-6QmaymbX4fKNNWdSc9rSV0-YtJlnH2XfWPuB45O03S7f7NpH9kIhdvzThaGw5Oml6Liv1yghvYdNo8qp9345fLU4t9jhAiXKBJ7vdpBkrchUFALlsBlpwRZlVLCjqK6cJ89hFN59lTBT-c68YMYythX9i5YeLfeanCcrU6sa',
  },
  {
    id: 'bateria-6000',
    name: 'Bateria Inteligente 6000mAh',
    description: 'Bateria adicional de íons de lítio premium de alta densidade energética para estender sua filmagem aérea.',
    price: 1200,
    rating: 4.9,
    reviewsCount: 88,
    category: 'Hardware',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB8yjSIqmVMICTrCaVxycN4tZD57z1G75Qvt3RR3C1zKYusyWSQML4vVw5vI2Vwn5veqZ0eF7w-TA20v_lLSUGnqZl44sO_4eRmlnK0r7fWII6seuH22nNsXMjHAjoqq72E-eab4NPYQ9zYA7CLfkpssPAspv7JSjgPlrSD2kgAhZDKhZo6H-O5cIvmLTx8gaRQV6TtNd8CH-Sv9bE_iqHMoQk3t13Bm8P4LSF1P8wFEORRMFyc7nGdUy_KyrBzd1F9faVvRUcL_Kx',
  },
  {
    id: 'filtros-nd',
    name: 'Kit Filtros ND Pro',
    description: 'Filtros de densidade neutra profissionais para cinemática perfeita em qualquer condição de luz natural.',
    price: 450,
    rating: 4.6,
    reviewsCount: 19,
    category: 'Acessórios',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbo3s_fK8ywixWAbAzzHU4RtxQwietSOnAkFKd_N8FTENyPToskXQ9R7bNk0cuvNOb3Ng7lyi4DDbu69ysOp6pB8ha_PU_7kkRmHOZxttTfzSwQ15ZgYqGN6XhbgEVMIo5mbLNaGqOE7MatXyHgXnEccu2DTBZsSZOJ8b4QJjN7x-EQU1eVPCkBGoA83hgeols7UIV6UMQ2rh4_Cf8e2YsET6mei8XTmr9cPVWQUboi0SJ_OR2lovBklyjrc9Zy8BtrgnECMr_T5tF',
  },
  {
    id: 'cartao-sd-512',
    name: 'Cartão SD Extreme 512GB',
    description: 'Micro SD profissional de altíssima velocidade de gravação, homologada para capturas ininterruptas em 8K HDR.',
    price: 680,
    rating: 4.9,
    reviewsCount: 140,
    category: 'Acessórios',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa7s8UNPCcklaJpFAJAoZ6lP_k9jzMtkCvhas9vTuczuzGW0g4ui26rn2oasczMKmRh6QuzF21bibOEaX-BLFS68ZdX_1ZGdAqDDWw95SnymqXWvfyRcKAMquf1LWhpkhTYS7JIOoBsjMcvOzf55f3f_9jeJMiwpFpTJvUR7nn18sV2veWaQNMfuYZ6V96lk5M79SE5GnOWZ_MeR65x624GnYNiKDqN-6hvWfqxSWyFdanh9bz0gS9UZIv3cjRigpQKolOFmvrARQx',
  }
];

export const COUPONS: PromoCoupon[] = [
  {
    code: 'VIOLET20',
    discountPercentage: 20,
    description: '20% de Desconto na primeira aquisição'
  }
];
