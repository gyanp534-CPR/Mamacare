/**
 * MamaCare — Comprehensive Indian Meal Plans
 * Authentic desi food options for all trimesters + postpartum
 */

const MEAL_PLANS_INDIAN = {
  1: {
    focus: 'Folic Acid, B6 (nausea relief), Iron, Zinc. Small frequent meals for sensitive stomach.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Poha with peanuts & curry leaves (B6, easy to digest)',
          'Idli-sambhar with coconut chutney (fermented, probiotic)',
          'Moong dal cheela with mint chutney',
          'Banana with whole wheat paratha',
          'Dalia (broken wheat) upma with vegetables',
          'Ragi porridge with jaggery',
          'Ginger-lemon water or jeera water (nausea relief)'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Handful of soaked almonds & walnuts (omega-3)',
          '2-3 dates with warm milk (iron, calcium)',
          'Fresh coconut water (electrolytes, hydration)',
          'Roasted makhana (fox nuts) with light spices',
          'Seasonal fruits - apple, pear, berries (avoid papaya)',
          'Buttermilk with roasted jeera'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Dal (moong/masoor) + brown rice or roti',
          'Palak paneer or methi sabzi (folate, iron)',
          'Curd or buttermilk (probiotics, calcium)',
          'Salad with lemon (Vitamin C boosts iron 3x)',
          'Rajma or chana curry (protein, fiber)',
          'Lauki (bottle gourd) or tinda sabzi'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Moong dal khichdi with ghee (easy digest)',
          'Vegetable soup (carrot, tomato, spinach)',
          'Roti with lauki or tinda sabzi',
          'Warm turmeric milk (anti-inflammatory)',
          'Light paneer bhurji with roti',
          'Idli or dosa with sambar (light option)'
        ]
      }
    ],
    avoid: [
      'Raw papaya (latex causes contractions)',
      'Pineapple (bromelain enzyme)',
      'Ajinomoto/Chinese food (MSG)',
      'Unpasteurized paneer/cheese',
      'Raw sprouts (bacteria risk)',
      'Alcohol, smoking (strict no)'
    ]
  },
  
  2: {
    focus: 'Calcium, Vitamin D, Omega-3, Protein. Baby bones and brain developing rapidly.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Ragi porridge with jaggery (calcium, iron powerhouse)',
          'Besan cheela with vegetables',
          '2 boiled eggs + whole wheat toast',
          'Oats with milk, nuts & berries',
          'Paratha (aloo/paneer/methi) with curd',
          'Fresh orange or mosambi juice (Vitamin C)',
          'Upma with vegetables and peanuts'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Greek yogurt with honey & mixed nuts',
          'Ragi or til (sesame) ladoo (calcium boost)',
          'Roasted chana (chickpeas) - protein, fiber',
          'Coconut water with sabja (basil) seeds',
          'Dry fruits mix (anjeer, badam, akhrot)',
          'Paneer cubes with cherry tomatoes'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Fish curry (rohu/katla) or tofu curry (omega-3)',
          'Rajma masala or chhole (protein, iron)',
          'Brown rice + dal + mixed sabzi',
          'Paneer tikka or grilled chicken',
          'Raita with cucumber & boondi',
          'Salad with flaxseed powder',
          'Methi paratha with curd'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Paneer butter masala with roti',
          'Methi paratha with curd (iron, folate)',
          'Dal makhani with jeera rice',
          'Sweet potato chaat (beta-carotene)',
          'Palak soup or mixed vegetable soup',
          'Warm milk with saffron strands',
          'Grilled fish with vegetables'
        ]
      }
    ],
    avoid: [
      'Junk food (chips, burgers, pizza)',
      'Excess sweets (gestational diabetes risk)',
      'Caffeine >200mg/day (1 cup chai is okay)',
      'Smoked or processed meats',
      'Street food (hygiene concerns)'
    ]
  },
  
  3: {
    focus: 'Vitamin K, Iron, Calcium, Fiber (for constipation). Very small frequent meals as stomach is cramped.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Oats with flaxseeds & dates (fiber, omega-3)',
          'Ragi dosa with sambar',
          'Soaked anjeer (figs) with warm milk',
          'Whole wheat toast with peanut butter',
          'Poha with vegetables & peanuts',
          'Warm water with honey & lemon',
          'Moong dal cheela (light, protein-rich)'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Dry fruits ladoo (energy boost)',
          'Tender coconut water (hydration)',
          'Roasted makhana with light spices',
          'Fresh fruits (apple, pear, berries)',
          'Buttermilk with roasted jeera',
          'Dates with almonds'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Palak paneer (iron + calcium perfect combo)',
          'Dal makhani with small rice portion',
          'Curd rice with pickle (easy to digest)',
          'Grilled fish or chicken (protein)',
          'Mixed vegetable sabzi (avoid gas-forming)',
          'Small portions, eat slowly',
          'Moong dal khichdi with ghee'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Light moong dal khichdi with ghee',
          'Ajwain paratha (aids digestion)',
          'Vegetable soup (avoid gas-causing veggies)',
          'Boiled vegetables with roti',
          'Avoid heavy meals (heartburn risk)',
          'Warm milk with cardamom',
          'Idli with light sambar'
        ]
      }
    ],
    avoid: [
      'Gas-forming foods (rajma, chana, cabbage, broccoli)',
      'Spicy food (heartburn gets worse)',
      'Large meals (eat small portions 6-7 times)',
      'Lying down immediately after eating',
      'Carbonated drinks',
      'Fried and oily foods'
    ]
  },
  
  4: {
    focus: 'Postpartum Recovery + Breastfeeding: Protein, Iron, Calcium, Omega-3, Hydration. Traditional Indian foods for healing.',
    meals: [
      {
        t: '<i data-lucide="sunrise" class="app-icon-inline"></i> Breakfast',
        i: [
          'Methi paratha with generous ghee (milk supply booster)',
          '2 boiled eggs or paneer bhurji (protein)',
          'Warm turmeric milk with saffron (healing, anti-inflammatory)',
          'Ragi porridge with jaggery (calcium, iron)',
          'Soaked almonds & dates (energy, strength)',
          'Ajwain water (digestion, gas relief)',
          'Moong dal cheela with ghee'
        ]
      },
      {
        t: '<i data-lucide="cookie" class="app-icon-inline"></i> Mid-morning Snack',
        i: [
          'Gond ladoo or dry fruits ladoo (strength, warmth)',
          'Coconut water (hydration, electrolytes)',
          'Almonds, cashews, walnuts (omega-3)',
          'Til (sesame) ladoo (calcium, warmth)',
          'Fresh fruit juice (room temperature, not cold)',
          'Paneer cubes with nuts'
        ]
      },
      {
        t: '<i data-lucide="sun" class="app-icon-inline"></i> Lunch',
        i: [
          'Dal + rice with generous ghee (strength)',
          'Chicken or fish curry (protein, omega-3)',
          'Palak or methi sabzi (iron, milk supply)',
          'Curd or buttermilk (probiotics, cooling)',
          'Moong dal khichdi (easy digest)',
          'Paneer curry with roti',
          'Lauki or tinda sabzi'
        ]
      },
      {
        t: '<i data-lucide="coffee" class="app-icon-inline"></i> Evening Snack',
        i: [
          'Ajwain or saunf water (lactation booster)',
          'Ragi malt with milk',
          'Gond katira sherbet (cooling, milk supply)',
          'Besan ladoo (protein, energy)',
          'Warm soup (vegetable or chicken)',
          'Methi ladoo (traditional healing)'
        ]
      },
      {
        t: '<i data-lucide="moon" class="app-icon-inline"></i> Dinner',
        i: [
          'Moong dal khichdi with ghee (easy digest)',
          'Paneer bhurji with roti (protein, calcium)',
          'Light chicken curry',
          'Vegetable soup (warm, not cold)',
          'Methi paratha (milk supply)',
          'Warm milk with cardamom',
          'Dal with rice and ghee'
        ]
      }
    ],
    avoid: [
      'Spicy and oily foods (can cause baby colic)',
      'Caffeine (passes to breast milk)',
      'Alcohol (strict no)',
      'Gas-forming foods (cabbage, rajma, beans)',
      'Cold foods and drinks (traditional advice)',
      'Processed and junk food'
    ]
  }
};

// Export for use in main app
if (typeof window !== 'undefined') {
  window.MEAL_PLANS_INDIAN = MEAL_PLANS_INDIAN;
}
