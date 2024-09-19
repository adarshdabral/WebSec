import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.swing.*;

public class ApiRequester extends JFrame {

    private JTextField urlField;
    private JButton button1, button2, button3, button4, button5, button6, button7, button8;

    public ApiRequester() {
        setTitle("WebSec Application");
        setSize(400, 400); 
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel panel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g;
                int width = getWidth();
                int height = getHeight();

                GradientPaint gp = new GradientPaint(0, 0, new Color(10, 36, 99), 0, height, new Color(30, 30, 30));
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, width, height);
            }
        };
        panel.setLayout(new GridLayout(10, 1, 10, 10)); 

        Color textColor = new Color(255, 255, 255);    
        Color buttonColor = new Color(70, 130, 180);   
        Color buttonHoverColor = new Color(100, 149, 237); 

        urlField = new JTextField(20);
        urlField.setBackground(new Color(43, 43, 43));
        urlField.setForeground(textColor);
        urlField.setCaretColor(textColor);

        button1 = new JButton("SQL attack");
        button2 = new JButton("Weak Admin Passwords");
        button3 = new JButton("Website Stresser");
        button4 = new JButton("XSS attack");
        button5 = new JButton("Deface Attack");
        button6 = new JButton("Basic Info Gathering");
        button7 = new JButton("DNS Records");
        button8 = new JButton("Full Scan");

        JButton[] buttons = {button1, button2, button3, button4, button5, button6, button7, button8};
        for (JButton button : buttons) {
            button.setBackground(buttonColor);
            button.setForeground(textColor);
            button.setFocusPainted(false); 

            button.addMouseListener(new java.awt.event.MouseAdapter() {
                public void mouseEntered(java.awt.event.MouseEvent evt) {
                    button.setBackground(buttonHoverColor);
                }

                public void mouseExited(java.awt.event.MouseEvent evt) {
                    button.setBackground(buttonColor);
                }
            });
        }

        JLabel label = new JLabel("Enter Website URL:");
        label.setForeground(textColor);

        panel.add(label);
        panel.add(urlField);
        panel.add(button1);
        panel.add(button2);
        panel.add(button3);
        panel.add(button4);
        panel.add(button5);
        panel.add(button6);
        panel.add(button7);
        panel.add(button8);

        button1.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/sqlscan"));
        button2.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/password"));
        button3.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/webstresser"));
        button4.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/xss"));
        button5.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/deface"));
        button6.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/basicscan"));
        button7.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/dnsrecord"));
        button8.addActionListener(new ButtonClickListener("http://deka.pylex.xyz:10037/fullscan"));

        add(panel);
    }

    private class ButtonClickListener implements ActionListener {
        private String apiUrl;

        public ButtonClickListener(String apiUrl) {
            this.apiUrl = apiUrl;
        }

        @Override
        public void actionPerformed(ActionEvent e) {
            String website = urlField.getText();
            if (!website.isEmpty()) {
                sendPostRequest(apiUrl, website);
            } else {
                JOptionPane.showMessageDialog(null, "Please enter a website URL");
            }
        }
    }

    private void sendPostRequest(String apiUrl, String website) {
        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; utf-8");
            conn.setDoOutput(true);

            String jsonInputString = "{\"website\":\"" + website + "\"}";

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = in.readLine()) != null) {
                response.append(responseLine.trim());
            }

            JOptionPane.showMessageDialog(null, "Response Text: " + response.toString());

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(null, "Error sending request to " + apiUrl);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            ApiRequester app = new ApiRequester();
            app.setVisible(true);
        });
    }
}