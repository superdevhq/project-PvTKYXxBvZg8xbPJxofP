
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

interface RequestBody {
  description: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    // Get the request body
    const body: RequestBody = await req.json()
    const { description } = body

    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Description is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Call OpenAI API to improve the job description
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional job description writer. Your task is to improve the provided job description to make it more professional, engaging, and comprehensive. Keep the same information but enhance the language, structure, and clarity. Make sure to highlight key responsibilities, qualifications, and benefits in a well-organized manner.'
          },
          {
            role: 'user',
            content: `Please improve this job description: ${description}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    const openAIData = await openAIResponse.json()
    
    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', openAIData)
      return new Response(
        JSON.stringify({ error: 'Failed to improve description', details: openAIData }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    const improvedDescription = openAIData.choices[0].message.content

    return new Response(
      JSON.stringify({ 
        improvedDescription,
        original: description
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
